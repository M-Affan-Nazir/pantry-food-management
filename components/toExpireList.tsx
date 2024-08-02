import { StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, Dimensions, Modal, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { updateItem } from '../functions/storage';

type itemTypeOut = {
    id : number,
    name : string,
    expiry : number,
    factor: string,
    quantity : number,
    price : number,
    created_at : number
}
type prop = {
    items : itemTypeOut[],
    db : SQLiteDatabase,
    updateList: (id:number, quantity:number) => void
}

export default function AboutToExpireList(x:prop){

    const w = Dimensions.get('window').width;
    const h = Dimensions.get('window').height;

    const [modal, setModal] = useState(false)
    const [chosenItem, setChosenItem] = useState<itemTypeOut>()
    const [update, setUpdate] = useState<number>(1)

    let items = x.items
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
            marginRight: 10,
          }}
          onPress={()=>{setChosenItem(item), setModal(true)}}
        >
          <Text style={{ color: 'black', fontSize: 17, fontWeight: 'bold' }}>
            {item.name}
          </Text>
          <Text style={{ fontSize: 11,  color:"black",  }}>{item.expiry} {item.factor}</Text>
        </TouchableOpacity>
      );

      function updateAdd(){
        if(chosenItem && (chosenItem?.quantity > update)){
            setUpdate(x => x+1)
        }
      }

      function updateSubstract(){
        if(chosenItem && (update > 1)){
            setUpdate(x => x-1)
        }
      }

      async function updateDB(){
        if(chosenItem){
            await updateItem(x.db, chosenItem?.id, update)
            x.updateList(chosenItem?.id, update)
            setModal(false)
            setUpdate(1)
        }
      }
    
    

    return(
        <View style={{backgroundColor:"white", paddingHorizontal:25,paddingVertical:25, borderRadius:7, marginHorizontal:w/33, marginTop:h/15, borderWidth:0.5, borderColor:"yellow"}}>
            <View style={{height:25, width:20, backgroundColor:"yellow", position:"absolute", marginTop:13, borderTopRightRadius:15, borderBottomRightRadius:15, justifyContent:"center",alignItems:"center"}}>
                <Ionicons name="timer-outline" size={17} style={{marginTop:1}} color="black" />
            </View>
            <Text style={{position:"absolute", marginTop:16.5, fontSize:13,  color:"black",  marginLeft: 19, fontWeight:"500"}}> Products About to Expire: </Text>
            <AboutToExpireCapsulation />

            <Modal visible={modal} onRequestClose={()=>{setModal(false)}} transparent={true}>
                <View style={{flex:1, justifyContent:"center", alignItems:"center", backgroundColor:'rgba(206, 222, 210, 0.7)'}}>
                    <View style={{width:w/1.5, backgroundColor:"white", borderRadius:25, paddingVertical:15}} >
                    <View style={{alignItems:"flex-end", marginTop:7, marginRight:9}} >
                        <TouchableOpacity style={{position:"absolute"}} onPress={()=>{setModal(false)}}>
                            <Entypo name="cross" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <Text style={{marginTop:35, marginLeft:15, fontSize:25, color:"black", fontWeight:"bold"}} >{chosenItem?.name.toLocaleUpperCase()}</Text>
                    <Text style={{marginTop:15, marginLeft:17, fontSize:15, color:"black"}}>Expires in: {chosenItem?.expiry} {chosenItem?.factor}</Text>
                    <Text style={{marginTop:7, marginLeft:17, fontSize:15, color:"black"}}>Quantity: {chosenItem?.quantity} Items</Text>
                    
                    <Text style={{marginTop:25, marginLeft:17, fontSize:15, color:"black"}}>Item's Used:</Text>
                    <View>
        
                    <View style={{flexDirection:"row", justifyContent:"center", marginTop:15}} >
                        <TouchableOpacity style={{borderColor:"black", borderWidth:0.5, paddingHorizontal:11, paddingVertical:11, marginHorizontal:7, backgroundColor:"lightgrey"}}  onPress={updateSubstract} >
                            <Entypo name="minus" size={24} color="black" />
                        </TouchableOpacity>
                        <View style={{borderColor:"black", borderWidth:0.5, paddingHorizontal:17, paddingVertical:11}} >
                        <Text style={{ color:"black" }} >{update}</Text>
                        </View>
                        <TouchableOpacity style={{borderColor:"black", borderWidth:0.5, paddingHorizontal:11, paddingVertical:11, marginHorizontal:7, backgroundColor:"lightgrey"}} onPress={updateAdd}>
                            <Entypo name="plus" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                      <View style={{justifyContent:"center", alignItems:"center", marginTop:15}} >
                          <TouchableOpacity style={{height:h/15, width:w/3, backgroundColor:"yellow", borderRadius:15, justifyContent:"center", alignItems:"center"}} onPress={updateDB}>
                              <Text style={{color:"black", fontSize:17}}>Update</Text>
                          </TouchableOpacity>
                      </View>
                    </View>
                    </View>
                </View>
            </Modal>
            
        </View>
    )

}