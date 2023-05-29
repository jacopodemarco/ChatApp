import React,{useState,useLayoutEffect,useEffect}from "react";

import { View, Text, Pressable, SafeAreaView, FlatList } from "react-native";

import { Feather } from "@expo/vector-icons";
import socket from "../utils/socket";
import ChatComponent from "../components/ChatComponent";
import { styles } from "../utils/styles";
import Modal  from "../components/Modal";


const Chat = () => {
    //👇🏻 Dummy list of rooms

   const [rooms, setRooms] = useState([{
    "_id": "64726923286e694eafe84564",
    "name": "ciao",
    "members": [
        "pr4wRMscAm1aSYQ1AAAD"
    ],
}
   ]);
   const [visible , setVisible] = useState(false)

//👇🏻 Runs when the component mounts

useLayoutEffect(() => {

    function fetchGroups() {
        fetch("http://localhost:3000/api")
            .then((res) => res.json())
            .then((data) => {
                
                setRooms(data);
            
        } )   .catch((err) => console.error(err));
    }
    fetchGroups();
    console.log(rooms)
    

}, []);

//👇🏻 Runs whenever there is new trigger from the backend
useEffect(() => {
    socket.on("roomsList", (room) => {
        setRooms(room);
        console.log(rooms)
    });
}, []);
    return (
        <SafeAreaView style={styles.chatscreen}>
            <View style={styles.chattopContainer}>
                <View style={styles.chatheader}>
                    <Text style={styles.chatheading}>Chats</Text>
            {/* 👇🏻 Logs "ButtonPressed" to the console when the icon is clicked */}
                    <Pressable onPress={() => {
                        
                        setVisible (true);
                        console.log("Button Pressed!")}}>
                        <Feather name='edit' size={24} color='green' />
                    </Pressable>
                </View>
            </View>
            <View style={styles.chatlistContainer}>
                {rooms.length > 0 ? (
                    <FlatList
                        data={rooms}
                        renderItem={({ item }) => <ChatComponent item={item} />}
                        keyExtractor={(item) => item._id}
                    />

                ) : (

                    <View style={styles.chatemptyContainer}>

                        <Text style={styles.chatemptyText}>No rooms created!</Text>
                        <Text>Click the icon above to create a Chat room</Text>
                    </View>
                )}
            </View>
            {visible ? (
                <Modal setVisible={setVisible}></Modal>
            ):
            (
                <div></div>
            )}
        </SafeAreaView>

    );

};


export default Chat;