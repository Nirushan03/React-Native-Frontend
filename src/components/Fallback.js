// import { StyleSheet, View ,Image} from "react-native";
// import React from "react";

// const Fallback =()=> {
//     return(
//         <View style={{alignItems:"center"}}>
//             {/* <Image source={require("../../assets/icon.png")}
//             style={{height:300,width:300}}/> */}
//          <Text>
//             Start Adding your item
//         </Text>
//         </View>
       
//     )
// }
// export default Fallback;

// const style=StyleSheet.create({});
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Fallback = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No items available.</Text> {/* ✅ Ensure text is inside <Text> */}
    </View>
  );
};

export default Fallback;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  text: {
    fontSize: 18,
    color: "gray",
  },
});
