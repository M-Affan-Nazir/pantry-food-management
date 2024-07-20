import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { PieChart } from 'react-native-chart-kit';


export default function Stat() {
  const w = Dimensions.get('window').width;
  const h = Dimensions.get('window').height;

  const data = [
    {
      name: 'Total Money Spent',
      amount: 440, 
      color: 'lightgreen',
    },
    {
      name: 'Total Money Wasted',
      amount: 60,
      color: 'red',
    },
  ];

  return (
      <View style={{backgroundColor:"white", paddingHorizontal:20,paddingVertical:25, borderRadius:7, marginHorizontal:w/33, marginTop:17, flexDirection:"row", borderWidth:0.5, borderColor:"lightgreen"}}>
        <View style={{height:25, width:20, backgroundColor:"lightgreen", position:"absolute", marginTop:13, borderTopRightRadius:15, borderBottomRightRadius:15, justifyContent:"center",alignItems:"center"}}>
          <FontAwesome name="dollar" size={13} style={{marginTop:1}} color="black" />
        </View>
        <Text style={{position:"absolute", color:"black", marginTop:16.5, fontSize:13, marginLeft: 25, fontWeight:"500"}}>Finance Statistics:</Text>
        <View style={{flexDirection:"row", marginTop: 11}} >  
          <View style={{justifyContent:"center", alignItems:"center"}}>
            <Text style={{fontSize:27,  color:"black", fontWeight:"500"}} >$500</Text>
            <Text style={{fontSize:11.7,  color:"black"}}>Utilized</Text>
          </View>
          <View style={{marginHorizontal:25, justifyContent:"center", alignItems:"center"}}>
            <Text style={{fontSize:27, fontWeight:"500",  color:"black", }} >$60</Text>
            <Text style={{fontSize:11.7,  color:"black", }}>Wasted</Text>
          </View>
          <PieChart
              data={data}
              hasLegend={false}
              width={70}
              height={70}
              chartConfig={{
                backgroundColor: '#1cc910',
                backgroundGradientFrom: '#eff3ff',
                backgroundGradientTo: '#efefef',
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
              style={{flex:1, paddingLeft:9}}
            />
            <View style={{marginLeft:75, marginTop:10}}>
              <View style={{flexDirection:"row"}}>
                <View  style={{height:10,width:10,backgroundColor:"lightgreen", marginTop:5, marginHorizontal:5}} />
                <Text style={{ color:"black", }}>Utilized</Text>
              </View>
              <View style={{flexDirection:"row"}}>
              <View  style={{height:10,width:10,backgroundColor:"red", marginTop:5, marginHorizontal:5}} />
              <Text style={{ color:"black", }}>Wasted</Text>
              </View>
            </View>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
});
