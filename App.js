import { useState, useEffect, useCallback, useRef, Dimensions } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, FlatList, StyleSheet, Text, View } from "react-native";
import { CheckBox, Input, Button } from "@rneui/themed";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native-web";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import { log } from "react-native-reanimated";

const Stack = createNativeStackNavigator();
const loginData = [];
const defaultUser = {
  username: "test",
  password: "Test1@",
  usrRegiment: [0, 1, 2, 3, 4],
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
            if (flags[i] == true) {
              gate = gate + 1;
            }
          }
          if (gate != flags.length) {
            alert("All fields must be filled in correctly.");
          } else {
            loginData.pop();
            loginData.push(newUser);
            navigation.navigate("Regiment Selection", { loginData: loginData });
          }
        }}
      ></Button>
    </>
  );
}
function EditingScreen({ navigation, route }) {
  let { loginData } = route.params;

  let [mon, setMon] = useState("Push");
  let [tue, setTue] = useState("Pull");
  let [wed, setWed] = useState("Legs");
  let [thu, setThu] = useState("Rest");
  let [fri, setFri] = useState("Legs");
  let [sat, setSat] = useState("Shoulders");
  let [sun, setSun] = useState("Rest");

  let selections = [mon, tue, wed, thu, fri, sat, sun];
  let newRegiment = [];

  function clearArray(array) {
    for (let i = 0; i <= array.length + 1; i++) {
      array.pop();
    }
  }

  function handleSelections(value) {
    switch (value) {
      case "Push":
        return 0;
      case "Pull":
        return 1;
      case "Legs":
        return 2;
      case "Shoulders":
        return 3;
      case "Rest":
        return 4;
    }
  }

  // const colors = ["tomato", "thistle", "skyblue", "teal"];
  return (
    <>
      {/* <SwiperFlatList
        index={2}
        showPagination
        data={colors}
        renderItem={({ item }) => (
          <View style={[styles.child, { backgroundColor: item }]}>
            <Text style={styles.text}>{item}</Text>
          </View>
        )}
      /> */}
      <Button title="Test" onPress={() => console.log(loginData)}></Button>
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
          console.log(selections);
          newRegiment = selections.map(handleSelections);
          if (loginData[0].usrRegiment.length != 0) {
            clearArray(loginData[0].usrRegiment);
            loginData[0].usrRegiment.push(newRegiment);
          } else {
            loginData[0].usrRegiment.push(newRegiment);
          }
        }}
      ></Button>

      <Button
        title="Return to Workout Selection"
        onPress={() => {
          navigation.navigate("Regiment Selection", {
            loginData: loginData,
          });
        }}
      ></Button>
    </>
  );
}

function SelectionScreen({ navigation, route }) {
  let { loginData } = route.params;
  let defaultReg = [0, 1, 2, 3, 4];
  let madeReg = false;

  if (loginData[0].usrRegiment.length != 0) {
    madeReg = true;
  } else {
    console.log("current user has made no regiment");
  }

  return (
    <>
      <Text>This is the Workout Selection Screen</Text>
      <Button
        title="Edit Regiment"
        onPress={() => {
          navigation.navigate("Regiment Editor", { loginData: loginData });
        }}
      ></Button>
      <Button
        title="Begin Custom Workout"
        onPress={() => {
          if (madeReg) {
            // console.log(loginData[0].usrRegiment);
            navigation.navigate("Workout", { loginData: loginData });
          } else {
            alert("You must make a custom regiment first!");
          }
        }}
      ></Button>
      <Button
        title="Begin Generic Workout"
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

function CurrentExerciseScreen({ navigation, route }) {
  let [reps, setReps] = useState(0);
  let { loginData } = route.params;
  let currentReg = loginData[0].usrRegiment;
  const d = new Date();
  let day = d.getDay();
  let regIndex = currentReg[0][day];
  switch (regIndex) {
    case 0:
      return (
        <>
          <Text>This is the Push Day Screen</Text>
          <Text>Current Exercise: </Text>
          <Text>{reps}</Text>
          <View>
            <Button
              onPress={() => {
                setReps(reps + 1);
              }}
            >
              +1 Rep
            </Button>
            <Button
              onPress={() => {
                setReps((reps = 0));
              }}
            >
              Set Reps to 0
            </Button>
          </View>
          <Button
            title="Return to Workout Selection"
            onPress={() => {
              navigation.navigate("Regiment Selection", {
                loginData: loginData,
              });
            }}
          ></Button>
        </>
      );
    case 1:
      return (
        <>
          <Text>This is the Push Day Screen</Text>
          <Text>Current Exercise: </Text>
          <Text>{reps}</Text>
          <View>
            <Button
              onPress={() => {
                setReps(reps + 1);
              }}
            >
              +1 Rep
            </Button>
            <Button
              onPress={() => {
                setReps((reps = 0));
              }}
            >
              Set Reps to 0
            </Button>
          </View>
          <Button
            title="Return to Workout Selection"
            onPress={() => {
              navigation.navigate("Regiment Selection", {
                loginData: loginData,
              });
            }}
          ></Button>
        </>
      );
    case 2:
      return (
        <>
          <Text>This is the Leg Day Screen</Text>
          <Text>Current Exercise: </Text>
          <Text>{reps}</Text>
          <View>
            <Button
              onPress={() => {
                setReps(reps + 1);
              }}
            >
              +1 Rep
            </Button>
            <Button
              onPress={() => {
                setReps((reps = 0));
              }}
            >
              Set Reps to 0
            </Button>
          </View>
          <Button
            title="Return to Workout Selection"
            onPress={() => {
              navigation.navigate("Regiment Selection", {
                loginData: loginData,
              });
            }}
          ></Button>
        </>
      );
    case 3:
      return (
        <>
          <Text>This is the Shoulders Day Screen</Text>
          <Text>Current Exercise: </Text>
          <Text>{reps}</Text>
          <View>
            <Button
              onPress={() => {
                setReps(reps + 1);
              }}
            >
              +1 Rep
            </Button>
            <Button
              onPress={() => {
                setReps((reps = 0));
              }}
            >
              Set Reps to 0
            </Button>
          </View>
          <Button
            title="Return to Workout Selection"
            onPress={() => {
              navigation.navigate("Regiment Selection", {
                loginData: loginData,
              });
            }}
          ></Button>
        </>
      );
    case 4:
      return (
        <>
          <Text>This is the Rest Day Screen</Text>
          <Text>Current Exercise: </Text>
          <Text>{reps}</Text>
          <View>
            <Button
              onPress={() => {
                setReps(reps + 1);
              }}
            >
              +1 Rep
            </Button>
            <Button
              onPress={() => {
                setReps((reps = 0));
              }}
            >
              Set Reps to 0
            </Button>
          </View>
          <Button
            title="Return to Workout Selection"
            onPress={() => {
              navigation.navigate("Regiment Selection", {
                loginData: loginData,
              });
            }}
          ></Button>
        </>
      );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "darkgrey" },
  child: { justifyContent: "center" },
  text: { textAlign: "center" },
});
