import { useState, useEffect, useCallback, useRef } from "react";
import { CheckBox, Input, Button } from "@rneui/themed";
import * as React from "react";

export default function LoginScreen({ navigation, route }) {
  let [username, setUsername] = useState(" ");
  let [password, setPassword] = useState(" ");
  return (
    <>
      <Input placeholder="Username" onChangeText={setUsername}></Input>
      <Input placeholder="Password" onChangeText={setPassword}></Input>
      <Button
        color="#000"
        title="Login"
        testID="login-button"
        onPress={() => {
          console.log(`Username: ${username} Password: ${password}`);
          let validUser = (input) => input.username === username;
          let validPass = (input) => input.password === password;
          if (loginData.some(validUser) && loginData.some(validPass)) {
            navigation.navigate("Regiment Selection", { loginData: loginData });
          } else {
            alert(
              "Login invalid, please check your entries or press 'Register' to create an account."
            );
          }
        }}
      ></Button>
      <Button
        title="Register"
        onPress={() => {
          navigation.navigate("Registration");
        }}
      ></Button>
    </>
  );
}
