import { useState, useEffect, useCallback, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, FlatList, StyleSheet, Text, View } from "react-native";
import { CheckBox, Input, Button } from "@rneui/themed";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
const loginData = [];
const defaultUser = {
  username: "test",
  password: "Test1@",
};

export default function App() {
  useEffect(() => {
    async function getValue() {
      const value = await AsyncStorage.getItem("@loginData");
      if (value === null) {
        console.log("Storing user data" + JSON.stringify(defaultUser));
        loginData.push(defaultUser);
        await AsyncStorage.setItem("@loginData", JSON.stringify(loginData));
      } else {
        console.log("Retrieving user data" + value);
        loginData.push(...JSON.parse(value));
      }
    }
    getValue();
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Resistence Trainer" }}
        />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="Regiment Selection" component={SelectionScreen} />
        <Stack.Screen name="Regiment Editor" component={EditingScreen} />
        <Stack.Screen name="Goals" component={GoalsScreen} />
        <Stack.Screen name="Workout" component={CurrentExerciseScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function LoginScreen({ navigation }) {
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
          // console.log(loginData);
          // let validUser = (input) => input.username === username;
          // let validPass = (input) => input.password === password;
          navigation.navigate("Regiment Selection");
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
function RegistrationScreen({ navigation }) {
  return (
    <>
      <Text style={styles.header}>
        Please fill out the required fields below.
      </Text>
      <Input
        containerStyle={styles.input}
        placeholder="First Name"
        testID="firstname"
        onChangeText={setFname}
        name="firstname"
        errorMessage={validateName(fName)}
      ></Input>
      <Input
        containerStyle={styles.input}
        placeholder="Last Name"
        testID="lastname"
        onChangeText={setLname}
        errorMessage={validateName(lName)}
      ></Input>
      <Input
        containerStyle={styles.input}
        placeholder="Username"
        testID="username"
        onChangeText={setUsername}
      ></Input>
      <Input
        containerStyle={styles.input}
        placeholder="Password - Be sure to include an uppercase letter and a number."
        testID="password"
        onChangeText={setPassword}
        errorMessage={validatePassword(password)}
      ></Input>
      <Input
        containerStyle={styles.input}
        placeholder="Confirm Password"
        testID="confirmpassword"
        onChangeText={setConfrimPass}
        errorMessage={validateConfirmPass(confirmPass)}
      ></Input>
      <Input
        containerStyle={styles.input}
        placeholder="Email - someone@email.com"
        testID="email"
        onChangeText={setEmail}
        onBlur={() => {
          let result = validateEmail(email);
          return result;
        }}
        errorMessage={validateEmail(email)}
      ></Input>
      <Button
        style={styles.button}
        color="#000"
        title="Sign Up"
        testID="register-button"
        onPress={() => {
          loginData.push(newUser);
          for (var i = 0; i < flags.length; i++) {
            console.log(flags);
            if (flags[i] == true) {
              gate = gate + 1;
            }
          }
          console.log(gate);
          if (gate != 5) {
            alert("All fields must be filled in correctly.");
          } else {
            navigation.navigate("Todo Screen");
          }
        }}
      ></Button>
      <Text>This is the Registration Screen</Text>
      <Button
        title="Complete Registration"
        onPress={() => {
          navigation.navigate("Regiment Selection");
        }}
      ></Button>
    </>
  );
}

function SelectionScreen({ navigation }) {
  return (
    <>
      <Text>This is the Workout Selection Screen</Text>
      <Button
        title="Edit Regiment"
        onPress={() => {
          navigation.navigate("Regiment Editor");
        }}
      ></Button>
      <Button
        title="Begin Workout"
        onPress={() => {
          navigation.navigate("Workout");
        }}
      ></Button>
      <Button
        title="View Goals"
        onPress={() => {
          navigation.navigate("Goals");
        }}
      ></Button>
      <Button
        title="Log Out"
        onPress={() => {
          navigation.navigate("Login");
        }}
      ></Button>
    </>
  );
}

function EditingScreen({ navigation }) {
  return (
    <>
      <Text>This is the Regiment Editor Screen</Text>
      <Button
        title="Return to Workout Selection"
        onPress={() => {
          navigation.navigate("Regiment Selection");
        }}
      ></Button>
    </>
  );
}

function GoalsScreen({ navigation }) {
  return (
    <>
      <Text>This is the Goals Screen</Text>
      <Button
        title="Return to Workout Selection"
        onPress={() => {
          navigation.navigate("Regiment Selection");
        }}
      ></Button>
    </>
  );
}

function CurrentExerciseScreen({ navigation }) {
  return (
    <>
      <Text>This is the Workout Screen</Text>
      <Button
        title="Return to Workout Selection"
        onPress={() => {
          navigation.navigate("Regiment Selection");
        }}
      ></Button>
    </>
  );
}

const styles = StyleSheet.create({});
