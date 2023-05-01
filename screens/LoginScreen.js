import { useState, useEffect, useCallback, useRef } from "react";
import { CheckBox, Input, Button } from "@rneui/themed";
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  Pressable,
  TextInput,
} from "react-native";
import * as React from "react";

export default function LoginScreen({ navigation, route }) {
  let { loginData } = route.params;

  //state for each input field
  let [username, setUsername] = useState(" ");
  let [password, setPassword] = useState(" ");
  return (
    <>
      <View style={styles.container}>
        <View style={styles.inputGroup}>
          <Text style={styles.title}>Resistence Trainer - Native</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={setUsername}
          ></TextInput>
          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={setPassword}
          ></TextInput>
        </View>
        <View style={styles.buttonGroup}>
          <Pressable
            style={styles.logButton}
            onPress={() => {
              console.log(`Username: ${username} Password: ${password}`);
              let validUser = (input) => input.username === username;
              let validPass = (input) => input.password === password;
              if (loginData.some(validUser) && loginData.some(validPass)) {
                navigation.navigate("Regiment Selection", {
                  loginData: loginData,
                });
              } else {
                alert(
                  "Login invalid, please check your entries or press 'Register' to create an account."
                );
              }
            }}
          >
            <Text style={styles.logButtonFont}>Login</Text>
          </Pressable>
          <Pressable
            style={styles.regButton}
            onPress={() => {
              navigation.navigate("Registration", { loginData: loginData });
            }}
          >
            <Text style={styles.regButtonFont}>Register</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFC904",
  },
  regButton: {
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: "black",
    borderWidth: 1,
    borderColor: "black",
    width: width * 0.4,
    padding: 10,
  },
  logButton: {
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    backgroundColor: "#FFE278",
    borderWidth: 1,
    borderColor: "black",
    width: width * 0.4,
    padding: 10,
  },
  logButtonFont: {
    fontSize: 35,
    textAlign: "center",
  },
  regButtonFont: {
    fontSize: 35,
    color: "white",
    textAlign: "center",
  },
  buttonGroup: {
    flexDirection: "row",
    marginTop: 70,
  },
  input: {
    width: width * 0.85,
    fontSize: 30,
    color: "black",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 3,
    margin: 10,
  },
  inputGroup: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 15,
    backgroundColor: "white",
    padding: 10,
    margin: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    paddingBottom: 20,
  },
});
