import React, { useState, useEffect } from "react";
import { 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View,
  Modal, 
  ActivityIndicator,
  FlatList,
  Alert
} from "react-native";
import auth from '@react-native-firebase/auth';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import FabButton from "../../components/FabButton";
import ModalNewRoom from "../../components/ModalNewRoom";
import firestore from '@react-native-firebase/firestore';
import ChatList from "../../components/ChatList";

export default function ChatRoom(){
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const[user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateScreen, setUpdateScreen] = useState(false);

  useEffect(() => {
    const hasUser = auth().currentUser ? auth().currentUser.toJSON() : null;
    setUser(hasUser);
  }, [isFocused]);

  useEffect(()=>{
    let isActive = true;

    function getChats(){
      firestore()
      .collection('MESSAGE_THREADS')
      .orderBy('lastMessage.createdAt', 'desc')
      .limit(10)
      .get()
      .then((snapshot)=>{
        const threads = snapshot.docs.map(documentSnapShot => {
          return {
            _id: documentSnapShot.id,
            name: '',
            lastMessage: {text: ''},
            ...documentSnapShot.data()
          }
        });

        if(isActive){
          setThreads(threads);
          setLoading(false);          
        }

      })
    }

    getChats();

    return () => {
      isActive = false;
    }

  },[isFocused, updateScreen]);

  function handleSignOut(){
    auth()
    .signOut()
    .then(() => {
      setUser(null);
      navigation.navigate('SignIn');
    })
    .catch((error) => {
      alert(error)
    })
  }

  function deleteRoom(idOwner, idRoom) {
    if(idOwner !== user?.uid){
      alert('Você não tem permissão para excluir esse grupo.');
      return;
    } 
    Alert.alert(
      'Atenção!',
      'Tem certeza que deseja excluir esse grupo?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: () => {
            console.log('Exclusão cancelada pelo usuário.');
          },
        },
        {
          text: 'OK',
          onPress: () => {
            firestore()
              .collection('MESSAGE_THREADS')
              .doc(idRoom)
              .delete()
              .then(() => {
                console.log('Grupo excluído com sucesso!');
                setUpdateScreen(!updateScreen);
              })
              .catch(error => {
                console.error('Erro ao excluir o grupo:', error);
                setUpdateScreen(!updateScreen);
              });
          },
        },
      ],
      { cancelable: false }
    );
  }
  

  if(loading){
    return(
      <ActivityIndicator size='large' color='#555' style={[styles.container, {justifyContent: 'center', alignItems:'center'}]}/>
    )
  }
  
  return(
    <SafeAreaView style={styles.container}>     
      <View style={styles.headerRoom}>
        <View style={styles.headerRoomLeft}>
          {user && (
            <TouchableOpacity onPress={handleSignOut}>
              <Icon name="arrow-back" size={28} color="#FFF"/>
            </TouchableOpacity>
          )}

          <Text style={styles.title}>Grupos</Text>
        </View>

        <Icon name="search" size={28} color="#FFF"/>
      </View>

      <FlatList
        data={threads}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <ChatList data={item} deleteRoom={deleteRoom} userStatus={user}/>
        )}
      />

      <FabButton setVisible={() => setModalVisible(true)} userStatus={user}/>
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <ModalNewRoom setVisible={() => setModalVisible(false)} updateScreen={() => setUpdateScreen(!updateScreen)}/>
      </Modal>
    </SafeAreaView>
  )
} 

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#FFF'
  },
  headerRoom:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#2E54D4',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20
  },
  headerRoomLeft:{
    flexDirection: 'row',
    alignItems: 'center'
  },
  title:{
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    paddingLeft: 10
  }
})