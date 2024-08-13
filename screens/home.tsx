import { StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, Dimensions, Modal, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Stat from '../components/statistics';
import { StackNavigationProp } from '@react-navigation/stack';
import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { getItems, getUtilized } from '../functions/storage';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { seperateItems } from '../functions/dataManipulation';
import AboutToExpireList from '../components/toExpireList';
import Expired from '../components/Expired';

const w = Dimensions.get('window').width;
const h = Dimensions.get('window').height;

type HomeStackParamList = {
  Home: {db : SQLiteDatabase}; 
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
  const [forceUpdate, setForceUpdate] = useState(false)
  const [utilized, setUtilized] = useState<number>(0)

    useEffect(()=>{
      const get = async () => {
        const ut = await getUtilized(x.route.params.db)
        setUtilized(ut)
      }
      get()
    })

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
      const gotten = await getItems(x.route.params.db)
      const util = await getUtilized(x.route.params.db)
      const {te, e} = seperateItems(gotten)
      setItems(te)
      setExpired(e)
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


  return (
    <View style={styles.container}>
      <TouchableOpacity style= {{backgroundColor:"white", padding:5, borderRadius:100, top:h-125, left:w/1.21, position:"absolute", borderColor:"#17bd24", borderWidth:2.1, justifyContent:"center", alignItems:"center"}} onPress={toggleOptionModal} >
        <AntDesign name="plus" size={41} color="black" />
        <Text style={{fontSize:11,  color:"black", }}>Add</Text>
      </TouchableOpacity>

      <AboutToExpireList items={items} db={x.route.params.db} updateList={updateList} />
      <Expired items={expired} />
      <Stat utilized={utilized} wasted={expired.length} />
    
      <Modal visible={modalOptionVisible} animationType="none" onRequestClose={toggleOptionModal} transparent={true} >
        <View style={{flex:1, justifyContent:"flex-end", backgroundColor:'rgba(206, 222, 210, 0.7)'}}>
          <TouchableHighlight style={{backgroundColor:"#fafafa", height:70, borderTopLeftRadius:20, borderTopRightRadius:20, flexDirection:"row"}} onPress={()=>{x.navigation.navigate("Camera"), setModalOptionVisible(false) }} >  
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
            </TouchableHighlight>
        </View>
      </Modal>
    </View>
  );

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
