import { StyleSheet, Text, View, StatusBar } from 'react-native';
import Home from "./screens/home"
import AddManually from './screens/addManual';
import CameraScreen from './screens/cameraScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';


const Stack = createStackNavigator();

function MyStack(){
  return(
    <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} options={{headerShown:false}} />
          <Stack.Screen name="AddManually" component={AddManually} options={{headerShown:false}}/>
          <Stack.Screen name="Camera" component={CameraScreen} options={{headerShown:false}}/>
    </Stack.Navigator>
  )
}

export default function App() {
  return(
    <NavigationContainer>
      <StatusBar backgroundColor="green" barStyle="light-content" />
      <MyStack />
    </NavigationContainer>
  )  
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});