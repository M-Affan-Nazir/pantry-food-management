import { StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, Dimensions, Modal, FlatList, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import Entypo from 'react-native-vector-icons/Entypo';

const w = Dimensions.get('window').width;
const h = Dimensions.get('window').height;

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
    items : itemTypeOut[]
}

export default function Expired(x : prop){
    let expired = x.items

    const [modal, setModal] = useState<boolean>(false)

    let renderExpired = ({ item }: { item: itemTypeOut }) => (
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
    
      function ExpiredCapsulation(){
        if(expired.length > 0){
          return (
          <FlatList
            horizontal
            data={expired}
            renderItem={renderExpired}
            keyExtractor={(item) => String(item.id)}
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


      function renderDetailExpired({ item }: { item: itemTypeOut }){
        return(
          <View style={{marginHorizontal:15, marginVertical:7}}>
            <View style={{flexDirection:"row"}} >
              <Text style={{fontSize:19, color:"black", fontWeight:"500"}}>{item.name.toLocaleUpperCase()}</Text>
              <Text style={{marginTop:3, marginLeft:5, color:"grey", fontSize:15}} >x{item.quantity}</Text>
            </View>
            <View  style={{height:1, backgroundColor:"lightgrey", marginHorizontal:10, marginVertical:3}} />
          </View>
        )
      }

    return(
      
      <View>
        <TouchableOpacity style={{backgroundColor:"white", paddingHorizontal:25,paddingVertical:25, borderRadius:7, marginHorizontal:w/33, marginTop:17, borderWidth:0.5, borderColor:"red"}} onPress={()=>{setModal(true)}} >
              <View style={{height:25, width:20, backgroundColor:"red", position:"absolute", marginTop:13, borderTopRightRadius:15, borderBottomRightRadius:15, justifyContent:"center",alignItems:"center"}}>
                  <Entypo name="cross" size={17} style={{marginTop:1}} color="white"/>
              </View>
              <Text style={{position:"absolute",  color:"black",  marginTop:16.5, fontSize:13, marginLeft: 19, fontWeight:"500"}}> Expired: </Text>
              <ExpiredCapsulation />
        </TouchableOpacity>

        <Modal visible={modal} onRequestClose={()=>{setModal(false)}} transparent>
          <View style={{flex:1, justifyContent:"center", alignItems:"center", backgroundColor:'rgba(206, 222, 210, 0.7)'}}>
            <View style={{width:w/1.5, backgroundColor:"white", borderRadius:25, paddingVertical:15, maxHeight:h/1.5}} >
              <View style={{alignItems:"flex-end", marginTop:7, marginRight:9}} >
                        <TouchableOpacity style={{position:"relative"}} onPress={()=>{setModal(false)}}>
                            <Entypo name="cross" size={24} color="black" />
                        </TouchableOpacity>
              </View>
              <Text style={{marginTop:0, marginLeft:15, fontSize:23, color:"black", fontWeight:"bold", marginBottom:8, textDecorationLine:"underline"}}>Expired Items:</Text>
              <FlatList
                data={expired}
                renderItem={renderDetailExpired}
                keyExtractor={(item) => String(item.id)}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </View>
        </Modal>
      </View>


    )

}