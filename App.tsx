import { StyleSheet, Text, View, StatusBar, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import Home from "./screens/home"
import AddManually from './screens/addManual';
import CameraScreen from './screens/cameraScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { getDBConnection, createTable, getItems } from './functions/storage';
import { seperateItems } from './functions/dataManipulation';
import { SQLiteDatabase } from 'react-native-sqlite-storage';
import BackgroundFetch from 'react-native-background-fetch';
import PushNotification, { PushNotificationScheduledLocalObject } from 'react-native-push-notification';


type RootStackParamList = {
  Home: {db : SQLiteDatabase};
  AddManually : {db : SQLiteDatabase}
  Camera: {db : SQLiteDatabase};
}
const Stack = createStackNavigator<RootStackParamList>();

export default function App() {

  const [db, setDb] = useState<SQLiteDatabase | null>(null)
  
  
    useEffect(()=>{
      async function loadDb(){
        const dataBase = await getDBConnection()
        await createTable(dataBase)
        setDb(dataBase)
      }
      loadDb()
    },[])

    const triggerNotification = (items:number) => {
      PushNotification.localNotification({
        channelId: 'default-channel-id', 
        title: "FreshKeep: Check your Pantry!",
        message: String(items) + " items expiring today.", // (required)
      });
    };
 
    let backgroundTask = async () => {
      const dataBase = await getDBConnection();
      await createTable(dataBase);
      if (dataBase) {
        const gotten = await getItems(dataBase);
        const { te, e } = seperateItems(gotten);
        const today = te.filter((x) => x.factor === "Today");
        const number = today.length;
        triggerNotification(number);
      } else {
        triggerNotification(5);
      }
      BackgroundFetch.finish(); // Signal completion
    };

    BackgroundFetch.configure({
      minimumFetchInterval: 15,  // <-- 1440 = minutes /day
      stopOnTerminate: false,
      startOnBoot: true,
    }, () => {
      backgroundTask();
    }, (error) => {
    });
    

  function MyStack(){
  
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