import { StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity, Linking, BackHandler } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useState, useEffect, useRef } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { Camera, useCameraDevice, CameraPermissionStatus } from 'react-native-vision-camera';
import TextRecognition from '@react-native-ml-kit/text-recognition';


const w = Dimensions.get('window').width;
const h = Dimensions.get('window').height;


type CameraStackParamList = {
  Home: undefined; 
  AddManually: undefined;
};

type CameraNavigationProp = StackNavigationProp<CameraStackParamList, 'Home'>;

interface NavigationContainerProp {
  navigation: CameraNavigationProp;
}


export default function CameraScreen(x : NavigationContainerProp) {

    const [permission, setPermission] = useState<CameraPermissionStatus | null>(null)
    const [uri, setUri] = useState("")
    const [text, setText] = useState("")
    const cameraRef = useRef<Camera>(null);
    
    const device = useCameraDevice('back')
    const checkPermission = async () => {
      const newPermission = await Camera.requestCameraPermission()
     setPermission(newPermission)
    }

    useEffect(()=>{checkPermission()},[])

    const getPic = async () => {
      if (cameraRef.current) {
        try {
            const photo = await cameraRef.current.takePhoto();
            setUri(photo.path)
            console.log('Photo URI:', photo.path); // Outputs the URI of the captured photo
        } catch (error) {
            console.error('Error taking picture:', error);
        }
        try{
          const result = await TextRecognition.recognize("file:///"+uri);
          setText(result.text)
          console.log("Recognized text:", text);
        }
        catch(error){
          console.error('Error Recognizing picture:', error);
        }
      }
    }

  if (permission === null || !device) {
    return(
        <View style={styles.container}>
            <TouchableOpacity style={{marginLeft:15, marginTop:55}} onPress={()=>{x.navigation.pop()}} >
                <AntDesign name="arrowleft" size={35} color="black" />
            </TouchableOpacity>
            <View style ={{flex:1, justifyContent:"center", alignItems:"center", marginBottom:h/5}} >
                <Text style={{fontWeight:"bold", fontSize:27}} >No Access to Camera</Text>
                <View style={{marginTop:27}}>
                    <Text style={{color:"blue"}}>Please Give Access from Settings</Text>
                </View>
            </View>
        </View>

    )
  }

  return (
    <View style={styles.container}>
       <Camera 
       style={{flex:1}}
        device={device}
        isActive={true}
        ref = {cameraRef}
        photo={true}
       />
       <TouchableOpacity style={styles.exitButton} onPress={() => x.navigation.pop()}>
                <AntDesign name="arrowleft" size={45} color="white" />
                <Text style={styles.exitButtonText}>EXIT</Text>
        </TouchableOpacity>
        <View style={styles.overlayContainer}>
            <Text style={styles.receiptText}>Receipt</Text>
            <View style={styles.receiptFrame} />
            <TouchableOpacity style={styles.captureButton} onPress={getPic}>
                <View style={styles.innerCircle} />
            </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', 
},
cameraStyle: {
    flex: 1,
    backgroundColor: 'transparent' 
},
exitButton: {
    position: 'absolute',
    top: 15, 
    left: 15, 
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
},
exitButtonText: {
    color: 'white',
    fontSize: 21,
    marginLeft: 10,
    fontWeight: 'bold',
},
overlayContainer: {
  position: 'absolute',
  top: h/17,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 10, // Make sure it's above the camera view
},
receiptText: {
  color: 'white',
  marginBottom: 9,
  fontSize: 18, // Adjust the font size for better visibility
},
receiptFrame: {
  height: h * 0.7, // Adjust the height as needed
  borderColor: 'white',
  borderWidth: 4.1,
  width: w / 1.2, // Width slightly less than the screen width
},
captureButton: {
  marginTop: 20, // Adjust spacing after the frame
  borderColor: 'white',
  borderWidth: 3,
  height: 55,
  width: 55,
  borderRadius: 55,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'transparent',
},
innerCircle: {
  backgroundColor: 'white',
  height: 37,
  width: 37,
  borderRadius: 45,
}
});