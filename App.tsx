import { StyleSheet, Text, View, StatusBar, ActivityIndicator } from 'react-native';
import { useState, useEffect, useContext } from 'react';
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
import SplashScreen from 'react-native-splash-screen'
import { DatabaseProvider } from './functions/databasecontext';
import { DatabaseContext } from './functions/databasecontext';

type RootStackParamList = {
  Home: undefined;
  AddManually : undefined;
  Camera: undefined;
}

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {

    useEffect(()=>{
      SplashScreen.hide();
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
      return(
        <DatabaseProvider>
        <Stack.Navigator>
              <Stack.Screen name="Home" component={Home} options={{headerShown:false}} />
              <Stack.Screen name="AddManually" component={AddManually} options={{headerShown:false}}/>
              <Stack.Screen name="Camera" component={CameraScreen} options={{headerShown:false}}/>
        </Stack.Navigator>
        </DatabaseProvider>
      )
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