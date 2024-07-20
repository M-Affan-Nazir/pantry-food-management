import { StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import AntDesign from 'react-native-vector-icons/AntDesign';

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


export default function AddManually(x : NavigationContainerProp) {

  const [text, setText] = useState("")

  return (
    <View style={styles.container}>
        <TouchableOpacity style={{marginLeft:15, marginTop:55}} onPress={()=>{x.navigation.pop()}} >
          <AntDesign name="arrowleft" size={35} color="black" />
        </TouchableOpacity>
        <View style={{flex:1, justifyContent:"center", marginBottom:h/2.7}} >
        <View style={{justifyContent:"center", alignItems:"center"}} >
          <TextInput value={text} autoCorrect={false} placeholder='Search Item' placeholderTextColor="grey" onChangeText={(x)=>{setText(x)}} style={{borderColor:"grey",borderWidth:1, height:h/3.5, width:w/1.1, backgroundColor:"white", textAlign:"center", fontSize:29}} />
        </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});