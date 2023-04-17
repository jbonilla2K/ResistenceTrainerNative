import { useState, useEffect, useCallback, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, FlatList, StyleSheet, Text, View } from "react-native";
import { CheckBox, Input, Button } from "@rneui/themed";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native-web";
import { Swiper, SwiperSlide } from "swiper/react";

const Stack = createNativeStackNavigator();
const loginData = [];
const defaultUser = {
  username: "test",
  password: "Test1@",
  usrRegiment: [],
};

//===============================user profile object structure==========================
// let newUser = {
//   username: username,
//   password: password,
//   firstName: fName,
//   lastName: lName,
//   email: email,
//   usrRegiment: [],
//   usrGoals: [],
// };

const workouts = [
  {
    key: 0,
    workout: "push",
    exercises: ["Push-Ups", "Incline Bench-Press", "Flat Bench-Press"],
  },
  {
    key: 1,
    workout: "pull",
    exercises: ["Pull-Ups", "Barbell Rows", "Cable Pulldowns"],
  },
  {
    key: 2,
    workout: "legs",
    exercises: ["Lunges", "Front Squats", "Squats"],
  },
  {
    key: 3,
    workout: "shoulders",
    exercises: ["Teacups", "Lateral Raise", "Face Pulls"],
  },
  {
    key: 4,
    workout: "rest",
    exercises: ["Toe Touch", "Dead Hang", "Shoulder Circles"],
  },
];

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

  let [currCustRegiment, setCurrCustRegiment] = useState([]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Regiment Editor">
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
          let validUser = (input) => input.username === username;
          let validPass = (input) => input.password === password;
          if (loginData.some(validUser) && loginData.some(validPass)) {
            navigation.navigate("Regiment Selection");
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
function RegistrationScreen({ navigation }) {
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let [confirmPass, setConfrimPass] = useState("");
  let [fName, setFname] = useState("");
  let [lName, setLname] = useState("");
  let [email, setEmail] = useState("");
  let newUser = {
    username: username,
    password: password,
    firstName: fName,
    lastName: lName,
    email: email,
    usrRegiment: [],
    usrGoals: [],
  };
  let flags = [false, false, false, false];
  let gate = 0;
  let nameRegEx = /^[^\d=?\\/@#%^&*()]+$/;
  let emailRegEx =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  function validateEmail(value) {
    let error;
    if (!value) {
      error = "";
    } else if (!emailRegEx.test(value)) {
      error = "Invalid email";
    } else {
      error = "";
      flags[3] = true;
    }
    return error;
  }
  function validateName(value) {
    let error;
    if (!value) {
      error = "";
    } else if (!nameRegEx.test(value)) {
      error = "Invalid";
    } else {
      flags[0] = true;
    }
    return error;
  }
  function validatePassword(value) {
    let error;
    if (!value) {
      error = "";
    } else if (!/[A-Z]/.test(value)) {
      error = "Please add uppercase letter";
    } else if (!/[0-9]/.test(value)) {
      error = "Please add a number";
    } else {
      flags[1] = true;
    }
    return error;
  }
  function validateConfirmPass(value) {
    let error;
    if (password !== value) {
      error = "Passwords do not match";
    } else if (!value) {
      error = "";
    } else {
      error = "";
      flags[2] = true;
    }
    return error;
  }
  return (
    <>
      <Text>Please fill out the required fields below.</Text>
      <Input
        placeholder="First Name"
        onChangeText={setFname}
        errorMessage={validateName(fName)}
      ></Input>
      <Input
        placeholder="Last Name"
        onChangeText={setLname}
        errorMessage={validateName(lName)}
      ></Input>
      <Input placeholder="Username" onChangeText={setUsername}></Input>
      <Input
        placeholder="Password - Be sure to include an uppercase letter and a number."
        onChangeText={setPassword}
        errorMessage={validatePassword(password)}
      ></Input>
      <Input
        placeholder="Confirm Password"
        onChangeText={setConfrimPass}
        errorMessage={validateConfirmPass(confirmPass)}
      ></Input>
      <Input
        placeholder="Email - someone@email.com"
        onChangeText={setEmail}
        onBlur={() => {
          let result = validateEmail(email);
          return result;
        }}
        errorMessage={validateEmail(email)}
      ></Input>
      <Button
        color="#000"
        title="Sign Up"
        testID="register-button"
        onPress={() => {
          for (var i = 0; i < flags.length; i++) {
            console.log(flags);
            if (flags[i] == true) {
              gate = gate + 1;
            }
          }
          console.log(gate);
          if (gate != flags.length) {
            alert("All fields must be filled in correctly.");
          } else {
            loginData.push(newUser);
            navigation.navigate("Regiment Selection");
          }
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
          // navigation.navigate("Workout");
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
function EditingScreen({ navigation, setCurrCustRegiment }) {
  let [mon, setMon] = useState(0);
  let [tue, setTue] = useState(0);
  let [wed, setWed] = useState(0);
  let [thu, setThu] = useState(0);
  let [fri, setFri] = useState(0);
  let [sat, setSat] = useState(0);
  let [sun, setSun] = useState(0);

  return (
    <>
      <TextInput value={mon} onChangeText={setMon}></TextInput>
      <TextInput value={tue} onChangeText={setTue}></TextInput>
      <TextInput value={wed} onChangeText={setWed}></TextInput>
      <TextInput value={thu} onChangeText={setThu}></TextInput>
      <TextInput value={fri} onChangeText={setFri}></TextInput>
      <TextInput value={sat} onChangeText={setSat}></TextInput>
      <TextInput value={sun} onChangeText={setSun}></TextInput>

      <Button
        title="Save Regiment"
        onPress={() => {
          console.log(loginData);
          // setCurrCustRegiment(mon, tue, wed, thu, fri, sat, sun);
        }}
      ></Button>

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
