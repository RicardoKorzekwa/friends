import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function FabButton({setVisible, userStatus}){
  const navigation = useNavigation();

    function handleNavigateButton(){
        userStatus ? setVisible() : navigation.navigate('SignIn');
    }

  return(
    <TouchableOpacity 
        style={styles.container}
        activeOpacity={0.9}
        onPress={handleNavigateButton}
    >
      <View>
        <Text style={styles.text}>+</Text>
      </View>
    </TouchableOpacity>
  )
} 

const styles = StyleSheet.create({
  container:{
    backgroundColor: '#2E54D4',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: '5%',
    right: '6%'
  },
  text:{
    fontSize: 25,
    color: '#FFF',
    fontWeight: 'bold',
  }
})