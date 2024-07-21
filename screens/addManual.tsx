import { StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity, Keyboard, KeyboardAvoidingView, FlatList, Modal, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';

const w = Dimensions.get('window').width;
const h = Dimensions.get('window').height;


type AddManualStackParamList = {
  Home: undefined; 
  AddManually: undefined;
};

type AddManualNavigationProp = StackNavigationProp<AddManualStackParamList, 'Home'>;

interface NavigationContainerProp {
  navigation: AddManualNavigationProp;
}

const data = [
  {
    name:"chicken",
    expiry:3,
    factor:"days",
  },
  {
    name:"frozen chicken",
    expiry:7,
    factor:"days"
  },
  {
    name:"chick peas",
    expiry:1,
    factor:"year"
  },
  {
    name:"ketchup",
    expiry:1,
    factor:"year"
  },

]

type resultItem={
  name:string,
  expiry:number,
  factor:string
}

type resultRenderItem={
  name:string,
  expiry:number,
  factor:string,
  quantity : number
}

export default function AddManually(x : NavigationContainerProp) {

  const [text, setText] = useState("")
  const [result, setResult] = useState<resultItem[]>()
  const [interModal, setInterModal] = useState<resultItem>()
  const [addAddModalVis, setAddModalVis] = useState(false)
  const [cart, addCart] = useState<resultRenderItem[]>([])
  const [quantity, setQuantity] = useState(1)
  const [cartDetailModal, setCartDetailModal] = useState(false)

  function checkDB(query=""){
    Keyboard.dismiss()
    setResult([])
    if(query!="" && query.length > 1){
      for(let i = 0; i<data.length;i++){
        let name = data[i].name
          if(name.includes(query.toLowerCase())){
            setResult(prev => [...(prev||[]),data[i]])
          }
      }
    }
  }


  function addToDataBase(){
    console.warn("Adding To DataBase")
  }

  function  renderResult({ item }: { item: resultItem }){
    return(
      <TouchableOpacity
      style={{
        backgroundColor: 'white',
        height: 65,
        width: 105,
        borderColor: 'lightgrey',
        borderWidth: 2,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 17,
        marginRight: 10, // Add some margin for spacing between items
      }}

      onPress={()=>{setInterModal(item), setAddModalVis(true)}}
    >
      <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold' }}>
        {item.name}
      </Text>
    </TouchableOpacity>
    )
  }

  function  renderCart({ item }: { item: resultRenderItem }){
    return(
      <View
      style={{
        marginLeft:10,
        marginVertical:5
      }}
    >
      <View style={{flexDirection: "row", justifyContent:"space-between"}} >
        <View>
        <Text style={{ color: 'black', fontSize: 17}}>
          {item.name.toLocaleUpperCase()}
        </Text>
        <Text style={{fontWeight:"bold", fontSize:14, marginLeft:5, marginTop:1, color:"grey"}}>x{item.quantity}</Text>
        </View>
        <TouchableOpacity style={{marginRight:15, backgroundColor:"red", paddingVertical:7, paddingHorizontal:5, justifyContent:"center", alignItems:"center"}} onPress={()=>removeFromCart(item.name)}>
          <Text style={{color:"white"}}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
    )
  }


  function SearchResultCompoentMessage(){
    if(result?.length != undefined && result?.length > 0){
      return(
        <View style={{marginTop:25}} >
          <Text>Search Results, Click to Add to Cart:</Text>
        </View>
      )
    }
  }   

  function toggleAddToCartModel(){
    setAddModalVis(!addAddModalVis)
  }

  function toggleAddCartModal(){
    setCartDetailModal(true)
  }

  function AddToCart(){
    addCart(prev => [...prev])
    if(interModal != undefined && cart?.length !== undefined) {
      let isPresent = false
      for(let i = 0; i<cart?.length; i++){
        if(cart[i].name == interModal.name){
          isPresent = true
        }
      }
      if(isPresent){
        const updatedItems = cart.map(item => {
          if (item.name === interModal.name) {
            return { ...item, quantity: item.quantity + quantity };
          }
          return item;
        });
        addCart(updatedItems);
        setAddModalVis(false)
        setQuantity(1)
      }
      else{
        addCart(prev => [...(prev), {...interModal, quantity:quantity}])
        setAddModalVis(false)
        setQuantity(1)
      }
    }
  }

  function removeFromCart(name:string){
    
    let updatedList = cart.filter(item => {
      return item.name !== name
    })
    addCart(updatedList)
    
  }

  function goBack(){
    if(cart.length == 0){
      x.navigation.pop()
    }
    else{
      console.warn("DOOOO: ADDING AUTOMATICALLY")
      x.navigation.pop()
    }
  }

  return (
    <View style={styles.container}>
        <TouchableOpacity style={{marginLeft:15, marginTop:25, position:"absolute"}} onPress={goBack} >
          <AntDesign name="arrowleft" size={35} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={{marginLeft:w/1.13, marginTop:25, position:"absolute", flexDirection:"row"}} onPress={()=>{toggleAddCartModal()}} >
          <FontAwesome name="shopping-basket" size={24} color="black" />
          {
            cart.length > 0 ? (<View style={{marginTop:11, backgroundColor:"red", borderRadius:100, paddingHorizontal:2, paddingVertical:2}} >
              <Text style={{color:"white"}} >{cart.length}</Text>
            </View>) : (<View></View>)
          }
          
        </TouchableOpacity>
        <View style={{flex:1, justifyContent:"center", position:"absolute", marginTop:h/7, marginLeft:w/21}} >
          <View style={{justifyContent:"center", alignItems:"center"}} >
            <TextInput value={text} autoCorrect={false} placeholder='Search Item' placeholderTextColor="grey" onChangeText={(x)=>{setText(x)}} style={{borderColor:"grey",borderWidth:1, height:h/3.5, width:w/1.1, backgroundColor:"white", textAlign:"center", fontSize:29, borderRadius:7}} />
            <TouchableOpacity style={{borderColor:"grey",borderWidth:0.5, height:65, width:w/1.7, backgroundColor:"yellow", marginTop:25, justifyContent:"center",alignItems:"center", borderRadius:7}} onPress={()=>{checkDB(text)}}>
              <Text style={{fontSize:17, color:"black"}} >Search</Text>
            </TouchableOpacity>
            <SearchResultCompoentMessage/>
            <FlatList
            horizontal
            data={result}
            renderItem={renderResult}
            keyExtractor={(item) => item.name}
            showsHorizontalScrollIndicator={true}
          />
          </View>
        </View>
        <Modal visible={addAddModalVis} animationType="none" onRequestClose={toggleAddToCartModel} transparent={true} >
        <View style={{flex:1, justifyContent:"flex-end", backgroundColor:'rgba(206, 222, 210, 0.7)'}}>
          <View style={{flexDirection:"row", backgroundColor:"white", borderTopLeftRadius:15, borderTopRightRadius:15, justifyContent:"space-between"}} >
            <TouchableOpacity style={{position:"absolute", left:w-31, top:7}} onPress={toggleAddToCartModel}>
                  <Entypo name="cross" size={24} color="black" />
            </TouchableOpacity>
            <View style={{paddingBottom:35, paddingTop:35}} >
              <Text style={{color:"black", fontSize:15, marginLeft:15, fontWeight:"bold"}} >{interModal?.name.toUpperCase()}</Text>
              <Text style={{color:"black", fontSize:15, marginLeft:15}} >Expiry Time: {interModal?.expiry} {interModal?.factor} </Text>
            </View>
            <View style={{paddingBottom:35, paddingTop:35, right:23, top:5}}>
              <View style={{flexDirection:"row"}} >
                <TouchableOpacity style={{borderColor:"black", borderWidth:0.5, paddingHorizontal:11, paddingVertical:11, marginHorizontal:7}} onPress={()=>{setQuantity(quantity+1)}}>
                  <Text style={{fontSize:17, color:"black"}} >+</Text>
                </TouchableOpacity>
                <View style={{borderColor:"black", borderWidth:0.5, paddingHorizontal:11, paddingVertical:11}} >
                  <Text style={{ color:"black" }} >{quantity}</Text>
                </View>
                <TouchableOpacity style={{borderColor:"black", borderWidth:0.5, paddingHorizontal:11, paddingVertical:11, marginHorizontal:7}}  onPress={()=>{ if(quantity>1) {setQuantity(quantity-1)}}} >
                  <Text style={{fontSize:21, color:"black"}} >-</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{paddingBottom:35, paddingTop:35, right:23, top:5}}>
              <TouchableOpacity style={{backgroundColor:"lightgreen", paddingVertical:11, paddingHorizontal:10}} onPress={AddToCart}>
                <Text style={{color:"black", fontSize:15}} >Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </Modal>


        <Modal visible={cartDetailModal} animationType="none" onRequestClose={() => setCartDetailModal(false)} transparent={true} >
        <View style={{flex:1, justifyContent:"flex-end", backgroundColor:'rgba(206, 222, 210, 0.7)'}}>
          <View style={{flexDirection:"column", backgroundColor:"white", borderTopLeftRadius:15, borderTopRightRadius:15, justifyContent:"space-between"}} >
            <View style={{position:"absolute", left:w-31}}>
            <TouchableOpacity style={{}} onPress={()=>{setCartDetailModal(false)}}>
                  <Entypo name="cross" size={24} color="black" />
            </TouchableOpacity>
            </View>
              <Text style={{fontSize:21, color:"black", marginVertical:15, marginLeft:5}} > Items in Cart: </Text>
              {
                cart.length == 0 ? (<View style={{marginLeft:11, marginBottom:10}}><Text>EMPTY</Text></View>) : (<FlatList
                horizontal={false}
                data={cart}
                renderItem={renderCart}
                keyExtractor={(item) => item.name}
                showsHorizontalScrollIndicator={false} />)
              }
            <TouchableOpacity style={{marginVertical:25, justifyContent:"center", alignItems:"center", backgroundColor:"lightgreen", paddingVertical:21, marginHorizontal:21, borderRadius:15}} onPress={addToDataBase}>
              <Text>ADD TO PANTRY</Text>
            </TouchableOpacity>
          </View>
        </View>
        </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});