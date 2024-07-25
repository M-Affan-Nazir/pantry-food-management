import { StyleSheet, Text, View, StatusBar, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import Home from "./screens/home"
import AddManually from './screens/addManual';
import CameraScreen from './screens/cameraScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { getDBConnection, createTable } from './functions/storage';
import { SQLiteDatabase } from 'react-native-sqlite-storage';



type RootStackParamList = {
  Home: {db : SQLiteDatabase};
  AddManually : {db : SQLiteDatabase}
  Camera: {db : SQLiteDatabase};
}
const Stack = createStackNavigator<RootStackParamList>();

function MyStack(){
  const [db, setDb] = useState<SQLiteDatabase | null>(null)

  useEffect(()=>{
    async function loadDb(){
      const dataBase = await getDBConnection()
      await createTable(dataBase)
      setDb(dataBase)
    }
    loadDb()
  },[])

  if(db == null){
    return(
      <View style={{flex:1, justifyContent:"center",alignItems:"center"}}>
        <ActivityIndicator color={"green"} size={"large"}/>
      </View>
    )
  }
  else{
    return(
      <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} options={{headerShown:false}} initialParams={{ db: db }} />
            <Stack.Screen name="AddManually" component={AddManually} options={{headerShown:false}} initialParams={{ db: db }}/>
            <Stack.Screen name="Camera" component={CameraScreen} options={{headerShown:false}} initialParams={{ db: db }}/>
      </Stack.Navigator>
    )
  }
}

export default function App() {
  return(
    <NavigationContainer>
      <StatusBar backgroundColor="lightgreen" barStyle="light-content" />
      <MyStack />
    </NavigationContainer>
  )  
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});