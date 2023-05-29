import React, { useLayoutEffect, useState,useEffect } from "react";

import { View, TextInput, Text, FlatList, Pressable } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import MessageComponent from "../components/MessageComponent";

import { styles } from "../utils/styles";
import socket from "../utils/socket";

const Messaging = ({ route, navigation }) => {

    const [chatMessages, setChatMessages] = useState([
        {
          _id : 0,

          }
    ]);

    const [message, setMessage] = useState("");

    const [user, setUser] = useState("");


    //👇🏻 Access the chatroom's name and id

    const { name, _id } = route.params;


//👇🏻 This function gets the username saved on AsyncStorage

    const getUsername = async () => {

        try {

            const value = await AsyncStorage.getItem("username");

            if (value !== null) {

                setUser(value);
            }

        } catch (e) {

            console.error("Error while loading username!");

        }

    };


    //👇🏻 Sets the header title to the name chatroom's name

    useLayoutEffect(() => {
        function fetchChats() {
            let base = "http://localhost:3000/messages?room="
            let address = base.concat(_id); 
            console.log(address);
            fetch(address)
                .then((res) => res.json())
                .then((data) => {
                    
                    setChatMessages(data);
                
            } )   .catch((err) => console.error(err));
        }
        fetchChats();
        navigation.setOptions({ title: name });
        getUsername()
        socket.emit("findRoom", _id);
    }, []);
   
    useEffect(() => {
         
        socket.on("newmsg", (messages) => {
            console.log(messages,messages.length)
            if (messages.length == 1){
                setChatMessages(chatMessages => [...chatMessages, messages[0]]);
            }else{
                setChatMessages(chatMessages => [...chatMessages, messages]);
            }
            });        
    }, []);
    /*👇🏻 

        This function gets the time the user sends a message, then 

        logs the username, message, and the timestamp to the console.

     */

    const handleNewMessage = () => {
        const room_id = _id;
        const hour =

            new Date().getHours() < 10

                ? `0${new Date().getHours()}`

                : `${new Date().getHours()}`;


        const mins =

            new Date().getMinutes() < 10

                ? `0${new Date().getMinutes()}`

                : `${new Date().getMinutes()}`;

        const data =  {
            room_id,
            message,
            user,

            timestamp: { hour, mins },

        };
                socket.emit("newMessage", data);

      setMessage("")
    };


    return (

        <View style={styles.messagingscreen}>

            <View

                style={[

                    styles.messagingscreen,

                    { paddingVertical: 15, paddingHorizontal: 10 },

                ]}

            >

                {chatMessages[0] ? (

                    <FlatList

                        data={chatMessages}

                        renderItem={({ item }) => (

                            <MessageComponent item={item} user={user} />

                        )}

                        keyExtractor={(item) => item._id}

                    />

                ) : (

                    ""

                )}

            </View>


            <View style={styles.messaginginputContainer}>

                <TextInput

                    style={styles.messaginginput}

                    onChangeText={(value) => setMessage(value)}

                />

                <Pressable

                    style={styles.messagingbuttonContainer}

                    onPress={handleNewMessage}

                >

                    <View>

                        <Text style={{ color: "#f2f0f1", fontSize: 20 }}>SEND</Text>

                    </View>

                </Pressable>

            </View>

        </View>

    );

};


export default Messaging;