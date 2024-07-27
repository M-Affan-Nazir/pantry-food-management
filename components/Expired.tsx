import { StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, Dimensions, Modal, FlatList } from 'react-native';
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

    return(
              
      <View style={{backgroundColor:"white", paddingHorizontal:25,paddingVertical:25, borderRadius:7, marginHorizontal:w/33, marginTop:17, borderWidth:0.5, borderColor:"red"}}>
            <View style={{height:25, width:20, backgroundColor:"red", position:"absolute", marginTop:13, borderTopRightRadius:15, borderBottomRightRadius:15, justifyContent:"center",alignItems:"center"}}>
                <Entypo name="cross" size={17} style={{marginTop:1}} color="white"/>
            </View>
            <Text style={{position:"absolute",  color:"black",  marginTop:16.5, fontSize:13, marginLeft: 19, fontWeight:"500"}}> Expired: </Text>
            <ExpiredCapsulation />
      </View>
    )

}