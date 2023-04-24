import { useState, useEffect, useCallback, useRef } from "react";
import { CheckBox, Input, Button } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import * as React from "react";

export default function LoginScreen({ navigation, route }) {
  let { loginData } = route.params;
  let [username, setUsername] = useState(" ");
  let [password, setPassword] = useState(" ");
  return (
    <>
      <View style={styles.container}>
        <Input placeholder="Username" onChangeText={setUsername}></Input>
        <Input placeholder="Password" onChangeText={setPassword}></Input>
        <View style={styles.buttonGroup}>
          <Button
            style={styles.button}
            color="#000"
            title="Login"
            testID="login-button"
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
          ></Button>
          <Button
            style={styles.button}
            title="Register"
            onPress={() => {
              navigation.navigate("Registration", { loginData: loginData });
            }}
          ></Button>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 150,
  },
  buttonGroup: {
    flexDirection: "row",
  },
});
