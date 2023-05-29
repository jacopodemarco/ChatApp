import React,{useState} from "react";
import { Text,SafeAreaView,View ,TextInput,Pressable,Alert } from "react-native";
import {styles} from "../utils/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Login = ({navigation}) => {
const [username, setUsername] = useState();
const [password, setPassword] = useState();
const storeUsername = async () => {
   
    try {

        //👇🏻 async function - saves the username to AsyncStorage

        //   redirecting to the Chat page

        await AsyncStorage.setItem("username", username);

        navigation.navigate("Chat");

    } catch (e) {

        console.log(e);
        Alert.alert("Error! While saving username");

    }

};


const handleSignIn = async() => {

    if (username.trim()) {
        const rawResponse = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: username, password: password})
          });
         console.log(JSON.stringify(rawResponse));
        //👇🏻 calls AsyncStorage function
        if (JSON.stringify(rawResponse.status) == 200)
        storeUsername();
        else{ Alert.alert("User not found!");}

    } else {

        Alert.alert("Username is required.");

    }

};

return(
    <SafeAreaView style={styles.loginscreen}>
            <View style={styles.loginscreen}>
                <Text style={styles.loginheading}>Sign in</Text>
                <View style={styles.logininputContainer}>

                    <TextInput
                        autoCorrect={false}
                        placeholder='Enter your username'
                        style={styles.logininput}
                        onChangeText={(value) => setUsername(value)}
                    />
                </View>
                <View style={styles.logininputContainer}>

                    <TextInput
                        autoCorrect={false}
                        placeholder='Enter your password'
                        style={styles.logininput}
                        onChangeText={(value) => setPassword(value)}
                        secureTextEntry={true}
                    />
                </View>
                <Pressable onPress={handleSignIn} style={styles.loginbutton}>
                    <View>
                        <Text style={styles.loginbuttonText}>Get Started</Text>
                    </View>
                </Pressable>

            </View>

        </SafeAreaView>
);







};
export default Login;