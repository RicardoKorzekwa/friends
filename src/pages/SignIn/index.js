import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TextInput, Platform, TouchableOpacity, View } from "react-native";

import auth from '@react-native-firebase/auth';
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/Feather';



export default function SignIn(){
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleLogin(){
    if(type){

      if(name === '' || email === '' || password === '') return;

      auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        user.user.updateProfile({
          displayName: name
        })
        .then(() => {
          navigation.goBack();
        })
      })
      .catch((error) => {
        if(error.code === 'auth/email-already-in-use'){
          console.log('Email já em uso!')
        }
        if(error.code === 'auth/invalid-email'){
          console.log('Email inválido!')
        }
      })

    }else{
      auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        navigation.goBack();
      })
      .catch((error) =>{
        if(error.code === 'auth/invalid-email'){
          console.log('Email inválido!')
        }
      })
    }
  }

  return(
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>Friends</Text>
      <Text style={{marginBottom: 20}}>Ajude, colabore, faça networking!</Text>

      { type && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(text) => setName(text)}
              placeholder="Qual seu nome?"
              placeholderTextColor="#99999B"
            />
          </View>
      ) }

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder="Seu email"
          placeholderTextColor="#99999B"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder="Sua senha"
          placeholderTextColor="#99999B"
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity 
          style={styles.icon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Icon name={showPassword ? "eye-off" : "eye"} size={24} color="#99999B" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.buttonLogin, {backgroundColor: type ? '#F53745' : '#57DD86'}]}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>{type ? 'Cadastrar' : 'Acessar'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setType(!type)}>
        <Text>{type ? 'Já possuo uma conta' : 'Criar uma nova conta'}</Text>
      </TouchableOpacity>

    </SafeAreaView>
  )
} 

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFF'
  },
  logo:{
    marginTop: Platform.OS === 'android' ? 55 : 80,
    fontSize: 28,
    fontWeight: 'bold'
  },
  input:{
    color: '#121212',
    backgroundColor: '#EBEBEC',
    width: '90%',
    borderRadius: 6,
    paddingHorizontal: 8,
    height: 50 
  },
  inputContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBEBEB',
    borderRadius: 6,
    marginBottom: 5,
    marginTop: 10,
    paddingHorizontal: 8,
    height: 50
  },
  icon: {
    position: 'absolute',
    right: 10,
  },
  buttonLogin:{
    width: '90%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 6
  },
  buttonText:{
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 19
  }
})
