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
import { createTable, getDBConnection, getItems } from '../functions/storage';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { seperateItems } from '../functions/dataManipulation';

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
  createdAt : number
}

export default function Home(x : Props) {

  const [modalOptionVisible, setModalOptionVisible] = useState(false);
  const [items, setItems] = useState<itemTypeOut[]>([])
  const [expired, setExpired] = useState<itemTypeOut[]>([])

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

  let renderItem = ({ item }: { item: itemTypeOut }) => (
    <TouchableOpacity
      style={{
        backgroundColor: 'white',
        height: 95,
        width: 115,
        borderColor: 'lightgrey',
        borderWidth: 2,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 17,
        marginRight: 10, // Add some margin for spacing between items
      }}
    >
      <Text style={{ color: 'black', fontSize: 17, fontWeight: 'bold' }}>
        {item.name}
      </Text>
      <Text style={{ fontSize: 11,  color:"black",  }}>{item.expiry} {item.factor}</Text>
    </TouchableOpacity>
  );

  let renderExpired = ({ item }: { item: Item }) => (
    <View
      style={{
        backgroundColor: 'white',
        height: 55,
        width: 95,
        borderColor: 'lightgrey',
        borderWidth: 2,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 17,
        marginRight: 10, // Add some margin for spacing between items
      }}
    >
      <Text style={{ color: 'black', fontSize: 21, fontWeight: 'bold' }}>
        {item.name}
      </Text>
    </View>
  );


  function AboutToExpireCapsulation(){
    if(items.length > 0){
      return (<FlatList
          horizontal
          data={items}
          renderItem={renderItem}
        
          keyExtractor={(item) => String(item.id)}
          showsHorizontalScrollIndicator={false}
        />)
    }
    else{
      return(

        <View style={{height: 95, width: 95, borderColor:"grey", borderStyle:"dashed", borderWidth:1.3, justifyContent:"center", alignItems:"center", marginTop: 17, marginRight: 10,}} >
            <Text>No Items</Text>
        </View>

      )
    }
  }


  function ExpiredCapsulation(){
    if(expired.length > 0){
      return (
      <FlatList
        horizontal
        data={data}
        renderItem={renderExpired}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
      />)
    }
    else{
      return(

        <View style={{height: 55, width: 95, borderColor:"grey", borderStyle:"dashed", borderWidth:1.3, justifyContent:"center", alignItems:"center", marginTop: 17, marginRight: 10,}} >
            <Text>No Items</Text>
        </View>

      )
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style= {{backgroundColor:"white", padding:5, borderRadius:100, top:h-125, left:w/1.21, position:"absolute", borderColor:"#17bd24", borderWidth:2.1, justifyContent:"center", alignItems:"center"}} onPress={toggleOptionModal} >
        <AntDesign name="plus" size={41} color="black" />
        <Text style={{fontSize:11,  color:"black", }}>Add</Text>
      </TouchableOpacity>
      <View style={{backgroundColor:"white", paddingHorizontal:25,paddingVertical:25, borderRadius:7, marginHorizontal:w/33, marginTop:h/15, borderWidth:0.5, borderColor:"yellow"}}>
        <View style={{height:25, width:20, backgroundColor:"yellow", position:"absolute", marginTop:13, borderTopRightRadius:15, borderBottomRightRadius:15, justifyContent:"center",alignItems:"center"}}>
          <Ionicons name="timer-outline" size={17} style={{marginTop:1}} color="black" />
        </View>
        <Text style={{position:"absolute", marginTop:16.5, fontSize:13,  color:"black",  marginLeft: 19, fontWeight:"500"}}> Products About to Expire: </Text>
        <AboutToExpireCapsulation />
      </View>
      <View style={{backgroundColor:"white", paddingHorizontal:25,paddingVertical:25, borderRadius:7, marginHorizontal:w/33, marginTop:17, borderWidth:0.5, borderColor:"red"}}>
        <View style={{height:25, width:20, backgroundColor:"red", position:"absolute", marginTop:13, borderTopRightRadius:15, borderBottomRightRadius:15, justifyContent:"center",alignItems:"center"}}>
          <Entypo name="cross" size={17} style={{marginTop:1}} color="white"/>
        </View>
        <Text style={{position:"absolute",  color:"black",  marginTop:16.5, fontSize:13, marginLeft: 19, fontWeight:"500"}}> Expired: </Text>
        <ExpiredCapsulation />
      </View>
      <Stat utilized={items.length} wasted={expired.length} />
    
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
