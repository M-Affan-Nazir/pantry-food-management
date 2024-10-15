import { StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, Dimensions, Modal } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Stat from '../components/statistics';
import { StackNavigationProp } from '@react-navigation/stack';
import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { getItems, getUtilized, reset } from '../functions/storage';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { seperateItems } from '../functions/dataManipulation';
import AboutToExpireList from '../components/toExpireList';
import Expired from '../components/Expired';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAdditionTime } from '../functions/dataManipulation';
import { DatabaseContext } from '../functions/databasecontext';


const w = Dimensions.get('window').width;
const h = Dimensions.get('window').height;

type HomeStackParamList = {
  Home: undefined; 
  AddManually: undefined;
  Camera: undefined
};
type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;


type itemTypeOut = {
  id : number,
  name : string,
  expiry : number,
  factor: string,
  quantity : number,
  price : number,
  created_at : number
}

export default function Home(x : Props) {

  const [modalOptionVisible, setModalOptionVisible] = useState(false);
  const [items, setItems] = useState<itemTypeOut[]>([])
  const [expired, setExpired] = useState<itemTypeOut[]>([])
  const [utilized, setUtilized] = useState<number>(0)
  const { db } = useContext(DatabaseContext);

  function getUTCFirstDayOfCurrentMonth(): number {
    const now = new Date(); 
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth();
    const firstDayOfMonth = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
    return Math.floor(firstDayOfMonth.getTime() / 1000);
  }

    useEffect(()=>{
      const get = async () => {
        if (db) {
          const ut = await getUtilized(db);
          setUtilized(ut);
        
        const lastUTCreset = await AsyncStorage.getItem('resetDone');
        if(lastUTCreset == null){
          const utcThis1st = String(getUTCFirstDayOfCurrentMonth())
          await AsyncStorage.setItem('resetDone', utcThis1st);
        }
        else{
          const t = Math.floor(Date.now() / 1000);
          if(t - parseInt(lastUTCreset, 10) >= 2592000){
              await reset(db, expired)
              setExpired([])
              const utcThis1st = String(getUTCFirstDayOfCurrentMonth())
              await AsyncStorage.setItem('resetDone', utcThis1st);
          }
          if(t < parseInt(lastUTCreset, 10)){
            const utcThis1st = String(getUTCFirstDayOfCurrentMonth())
            await AsyncStorage.setItem('resetDone', utcThis1st);
          }
        }
        
      }
      get()
    }})

  useEffect(()=>{
    getItemsFromDB()
  },[])

  useFocusEffect(
    React.useCallback(() => {
      getItemsFromDB()
      return () => {
        console.log("Screen focus Complete");
      };
    }, [])
  );

  async function getItemsFromDB(){
    if(db!= null){
      const gotten = await getItems(db)
      const util = await getUtilized(db)
      const {te, e} = seperateItems(gotten)
      setItems(te)
      setExpired(e)
    }
  }
  
  interface Item {
    key: string;
    name: string;
    days: string;
  }

  const data : Item[] = []

  
  async function updateList(id:number, quantity:number){
    let newList:itemTypeOut[] = []
    for(let i = 0; i<items.length; i++){
      if(items[i].id !== id){
        newList.push(items[i])
      }
      else{
        let q = items[i].quantity
        console.warn(quantity)
        if(q-quantity > 0){
          let newItem:itemTypeOut = items[i]
          newItem.quantity = q - quantity
          newList.push(newItem)
        }
      }
    }
    setItems(newList)
  }


  if(db != null){
    return (
      <View style={styles.container}>
        <TouchableOpacity style= {{backgroundColor:"white", padding:5, borderRadius:100, top:h-125, left:w/1.21, position:"absolute", borderColor:"#17bd24", borderWidth:2.1, justifyContent:"center", alignItems:"center"}} onPress={toggleOptionModal} >
          <AntDesign name="plus" size={41} color="black" />
          <Text style={{fontSize:11,  color:"black", }}>Add</Text>
        </TouchableOpacity>
  
        <AboutToExpireList items={items} updateList={updateList} />
        <Expired items={expired} />
        <Stat utilized={utilized} wasted={expired.reduce((accumulator, item) => accumulator + item.quantity, 0)} />
      
        <Modal visible={modalOptionVisible} animationType="none" onRequestClose={toggleOptionModal} transparent={true} >
          <View style={{flex:1, justifyContent:"flex-end", backgroundColor:'rgba(206, 222, 210, 0.7)'}}>
            {/* <TouchableHighlight style={{backgroundColor:"#fafafa", height:70, borderTopLeftRadius:20, borderTopRightRadius:20, flexDirection:"row"}} onPress={()=>{x.navigation.navigate("Camera"), setModalOptionVisible(false) }} >  
              <View style={{justifyContent:"center", flexDirection:"row" }}>
                <TouchableOpacity style={{position:"absolute", left:w-31, top:7}} onPress={toggleOptionModal}>
                  <Entypo name="cross" size={24} color="black" />
                </TouchableOpacity>
                <MaterialIcons name="document-scanner" size={35} color="grey" style={{marginTop:17, marginLeft:15}} />
                <Text style={{color:"grey", marginTop:21, marginLeft: 20, fontSize:19}}>Add By Scanning Receipt</Text>
              </View>
            </TouchableHighlight>
            <View style={{backgroundColor:"lightgrey", width:w, height:1.3}} />
              <TouchableHighlight style={{backgroundColor:"#fafafa", height:70}} onPress={()=>{x.navigation.navigate("AddManually"), setModalOptionVisible(false) }} >  
                <View style={{flexDirection:"row" }}>
                <FontAwesome name="pencil-square-o" size={35} color="grey" style={{marginTop:17, marginLeft:15}}  />
                    <Text style={{color:"grey", marginTop:21, marginLeft: 20, fontSize:19}}>Add Manually</Text>
                  </View>
              </TouchableHighlight> */}
            <TouchableHighlight style={{backgroundColor:"#fafafa", height:70, borderTopLeftRadius:20, borderTopRightRadius:20, flexDirection:"row"}} onPress={()=>{x.navigation.navigate("AddManually"), setModalOptionVisible(false) }}>  
              <View style={{justifyContent:"center", flexDirection:"row" }}>
                <TouchableOpacity style={{position:"absolute", left:w-31, top:7}} onPress={toggleOptionModal}>
                  <Entypo name="cross" size={24} color="black" />
                </TouchableOpacity>
                <FontAwesome name="pencil-square-o" size={35} color="grey" style={{marginTop:17, marginLeft:15}}  />
                <Text style={{color:"grey", marginTop:21, marginLeft: 20, fontSize:19}}>Add Manually</Text>
                </View>
            </TouchableHighlight>
  
          </View>
        </Modal>
      </View>
    );
  }

  function toggleOptionModal(){
    setModalOptionVisible(!modalOptionVisible)
  }

}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2'
  },
});
