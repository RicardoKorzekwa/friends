import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ChatList({data, deleteRoom, userStatus}){
    const navigation = useNavigation();
    
    function openChat(){
        if(!userStatus) return navigation.navigate('SignIn');

        navigation.navigate('Messages', {thread: data})
    }

    return(
        <TouchableOpacity onLongPress={() => deleteRoom(data.owner, data._id)} onPress={openChat}>
            <View style={styles.row}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.text} numberOfLines={1}>{data.name}</Text>
                    </View>
                    <View>
                        <Text style={styles.contentText} numberOfLines={1}>{data.lastMessage.text}</Text>
                    </View>
                </View>    
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    row:{
        paddingHorizontal: 10,
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(241, 240, 245, 0.5)',
        marginVertical: 4
    },
    content:{
        flexShrink: 1
    },
    header:{
        flexDirection: 'row',
    },
    content:{
        color: '#C1C1C1',
        fontSize: 16,
        marginTop: 2
    },
    text:{
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000'
    }
})