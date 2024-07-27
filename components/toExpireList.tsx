import { StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, Dimensions, Modal, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

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

export default function AboutToExpireList(x:prop){

    const w = Dimensions.get('window').width;
    const h = Dimensions.get('window').height;

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
            marginRight: 10, // Add some margin for spacing between items
          }}
        >
          <Text style={{ color: 'black', fontSize: 17, fontWeight: 'bold' }}>
            {item.name}
          </Text>
          <Text style={{ fontSize: 11,  color:"black",  }}>{item.expiry} {item.factor}</Text>
        </TouchableOpacity>
      );
    
    

    return(
        <View style={{backgroundColor:"white", paddingHorizontal:25,paddingVertical:25, borderRadius:7, marginHorizontal:w/33, marginTop:h/15, borderWidth:0.5, borderColor:"yellow"}}>
        <View style={{height:25, width:20, backgroundColor:"yellow", position:"absolute", marginTop:13, borderTopRightRadius:15, borderBottomRightRadius:15, justifyContent:"center",alignItems:"center"}}>
          <Ionicons name="timer-outline" size={17} style={{marginTop:1}} color="black" />
        </View>
        <Text style={{position:"absolute", marginTop:16.5, fontSize:13,  color:"black",  marginLeft: 19, fontWeight:"500"}}> Products About to Expire: </Text>
        <AboutToExpireCapsulation />
      </View>
    )

}