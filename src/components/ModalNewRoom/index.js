import React, { useState } from "react";
import { 
    StyleSheet, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    View,
    TouchableWithoutFeedback 
} from "react-native";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function ModalNewRoom({setVisible, updateScreen}){
    const [roomName, setRoomName] = useState('');
    const user = auth().currentUser.toJSON();

    function handleButtonCreate(){
      if(roomName === '') return;

      firestore().collection('MESSAGE_THREADS')
      .get()
      .then((snapshot) => {
        let myThreads = 0;

        snapshot.docs.map(docItem => {
          if(docItem.data().owner === user.uid){
            myThreads += 1
          }
        })

        if(myThreads >= 4){
          alert('Você atingiu o limite de grupos por usuário.')
        }else{
          createRoom();

        }
      })
    }

    function createRoom(){
      firestore()
      .collection('MESSAGE_THREADS')
      .add({
        name: roomName,
        owner: user.uid,
        lastMessage: {
          text: `Grupo ${roomName} criado. Bem vindo(a)!`,
          createdAt: firestore.FieldValue.serverTimestamp(),
        }
      })
      .then((docRef) => {
        docRef.collection('MESSAGES').add({
          text: `Grupo ${roomName} criado. Bem vindo(a)!`,
          createdAt: firestore.FieldValue.serverTimestamp(),
          system: true,
        })
        .then(()=>{
          setVisible();
          updateScreen();
        })

      })
      .catch((error) => {
        console.log(error)
      })
    }

  return(
    <View style={styles.container}>
        <TouchableWithoutFeedback onPress={() => {
          setVisible();
          updateScreen();
        }}>
            <View style={styles.modal}></View>
        </TouchableWithoutFeedback>

        <View style={styles.modalContent}>
            <Text style={styles.title}>Criar um novo Grupo?</Text>
            
            <TextInput
                value={roomName}
                onChangeText={(text) => setRoomName(text)}
                placeholder="Nome para sua sala?"  
                style={styles.input}  
            />

            <TouchableOpacity style={styles.buttonCreate}>
                <Text style={styles.buttonText} onPress={handleButtonCreate}>Criar sala</Text>
            </TouchableOpacity>
      </View>
    </View>
  )
} 

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: 'rgba(34, 34, 34, 0.4)',
  },
  modal:{
    flex: 1,
  },
  modalContent:{
    flex: 1,
    backgroundColor: '#FFF',
    padding: 15,
  },
  title:{
    marginTop: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 19
  },
  input:{
    borderRadius: 4,
    height: 45,
    backgroundColor: '#DDD',
    marginVertical: 15,
    fontSize: 16,
    paddingHorizontal: 5
  },
  buttonCreate:{
    borderRadius: 4,
    backgroundColor: '#2E54D4',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText:{
    fontSize: 19,
    fontWeight: 'bold',
    color: '#FFF'
  }
})