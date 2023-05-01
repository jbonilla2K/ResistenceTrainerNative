import { useState, useEffect, useCallback, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  TextInput,
} from "react-native";
import { CheckBox, Input, Button } from "@rneui/themed";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SwiperFlatList } from "react-native-swiper-flatlist";

import LoginScreen from "./screens/LoginScreen";

const Stack = createNativeStackNavigator();
const loginData = [];
const defaultUser = {
  username: "test",
  password: "Test1@",
  usrRegiment: [0, 1, 2, 3, 4],
};

function clearArray(array) {
  for (let i = 0; i <= array.length + 1; i++) {
    array.pop();
  }
}

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
          options={{ headerShown: false }}
          initialParams={{ loginData: loginData }}
        />
        <Stack.Screen
          name="Registration"
          component={RegistrationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Regiment Selection"
          component={SelectionScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Regiment Editor"
          component={EditingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Goals"
          component={GoalsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Workout"
          component={CurrentExerciseScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function RegistrationScreen({ navigation, route }) {
  //each state tracks a different required input field's value
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let [confirmPass, setConfrimPass] = useState("");
  let [fName, setFname] = useState("");
  let [lName, setLname] = useState("");
  let [email, setEmail] = useState("");

  //structure for each user's account information as storred in the loginData array
  let newUser = {
    username: username,
    password: password,
    firstName: fName,
    lastName: lName,
    email: email,
    usrRegiment: [],
    usrGoals: [[], [], [], []],
    usrMaxes: [
      ["0", "0", "0"],
      ["0", "0", "0"],
      ["0", "0", "0"],
      ["0", "0", "0"],
    ],
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
      <View style={styles.container}>
        <Text style={styles.instruction}>
          Please fill out the required fields below.
        </Text>
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            onChangeText={setFname}
            errorMessage={validateName(fName)}
          ></TextInput>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            onChangeText={setLname}
            errorMessage={validateName(lName)}
          ></TextInput>
          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={setUsername}
          ></TextInput>
          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={setPassword}
            errorMessage={validatePassword(password)}
          ></TextInput>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            onChangeText={setConfrimPass}
            errorMessage={validateConfirmPass(confirmPass)}
          ></TextInput>
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={setEmail}
            onBlur={() => {
              let result = validateEmail(email);
              return result;
            }}
            errorMessage={validateEmail(email)}
          ></TextInput>
        </View>
        <View style={styles.buttonGroup1}>
          <Pressable
            style={styles.logButton}
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
                navigation.navigate("Regiment Selection", {
                  loginData: loginData,
                });
              }
            }}
          >
            <Text style={styles.logButtonFont}>Sign Up</Text>
          </Pressable>
          <Pressable
            style={styles.returnButton}
            onPress={() => {
              navigation.navigate("Login");
            }}
          >
            <Text style={styles.returnButtonFont}>Return</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

function EditingScreen({ navigation, route }) {
  let { loginData } = route.params;
  let indicies = [];

  //use state that tracks if the user has saved any goals
  let [saved, setSave] = useState(true);

  if (loginData[0].usrRegiment.length != 0) {
    indicies = loginData[0].usrRegiment[0];
  } else {
    indicies = [0, 1, 2, 3, 4, 0, 1];
  }

  //each scrollRef tracks the position of a different day of the week slider
  const scrollRef1 = React.useRef(null);
  const scrollRef2 = React.useRef(null);
  const scrollRef3 = React.useRef(null);
  const scrollRef4 = React.useRef(null);
  const scrollRef5 = React.useRef(null);
  const scrollRef6 = React.useRef(null);
  const scrollRef7 = React.useRef(null);

  let newRegiment = [];

  function handleSelections(value) {
    switch (value) {
      case 0:
        return 0;
      case 1:
        return 1;
      case 2:
        return 2;
      case 3:
        return 3;
      case 4:
        return 4;
    }
  }

  const regDays = ["Push", "Pull", "Legs", "Shoulders", "Rest"];
  return (
    <>
      <SafeAreaView style={styles.container2}>
        <Text style={{ fontWeight: "bold", textAlign: "center", fontSize: 20 }}>
          Swipe the white lines to edit.
        </Text>
        <Text style={styles.label}>Sunday</Text>
        <SwiperFlatList
          ref={scrollRef1}
          index={indicies[0]}
          data={regDays}
          renderItem={({ item }) => (
            <View style={styles.slider}>
              <Text style={styles.text}>{item}</Text>
            </View>
          )}
        />
        <Text style={styles.label}>Monday</Text>

        <SwiperFlatList
          ref={scrollRef2}
          index={indicies[1]}
          data={regDays}
          renderItem={({ item }) => (
            <View style={styles.slider}>
              <Text style={styles.text}>{item}</Text>
            </View>
          )}
        />
        <Text style={styles.label}>Tuesday</Text>
        <SwiperFlatList
          ref={scrollRef3}
          index={indicies[2]}
          data={regDays}
          renderItem={({ item }) => (
            <View style={styles.slider}>
              <Text style={styles.text}>{item}</Text>
            </View>
          )}
        />
        <Text style={styles.label}>Wednesday</Text>
        <SwiperFlatList
          ref={scrollRef4}
          index={indicies[3]}
          data={regDays}
          renderItem={({ item }) => (
            <View style={styles.slider}>
              <Text style={styles.text}>{item}</Text>
            </View>
          )}
        />
        <Text style={styles.label}>Thursday</Text>
        <SwiperFlatList
          ref={scrollRef5}
          index={indicies[4]}
          data={regDays}
          renderItem={({ item }) => (
            <View style={styles.slider}>
              <Text style={styles.text}>{item}</Text>
            </View>
          )}
        />
        <Text style={styles.label}>Friday</Text>
        <SwiperFlatList
          ref={scrollRef6}
          index={indicies[0]}
          data={regDays}
          renderItem={({ item }) => (
            <View style={styles.slider}>
              <Text style={styles.text}>{item}</Text>
            </View>
          )}
        />
        <Text style={styles.label}>Saturday</Text>
        <SwiperFlatList
          ref={scrollRef7}
          index={indicies[1]}
          data={regDays}
          renderItem={({ item }) => (
            <View style={styles.slider}>
              <Text style={styles.text}>{item}</Text>
            </View>
          )}
        />
        <View style={styles.buttonGroup1}>
          <Pressable
            style={styles.saveButton}
            onPress={() => {
              let selections = [
                scrollRef1.current.getCurrentIndex(),
                scrollRef2.current.getCurrentIndex(),
                scrollRef3.current.getCurrentIndex(),
                scrollRef4.current.getCurrentIndex(),
                scrollRef5.current.getCurrentIndex(),
                scrollRef6.current.getCurrentIndex(),
                scrollRef7.current.getCurrentIndex(),
              ];
              console.log(selections);
              newRegiment = selections.map(handleSelections);
              if (loginData[0].usrRegiment.length != 0) {
                clearArray(loginData[0].usrRegiment);
                loginData[0].usrRegiment.push(newRegiment);
              } else {
                loginData[0].usrRegiment.push(newRegiment);
              }
              setSave(false);
            }}
          >
            <Text style={styles.saveButtonFont}>Save Regiment</Text>
          </Pressable>
          <Pressable
            style={saved ? styles.disabledButton : styles.returnButton3}
            disabled={saved}
            onPress={() => {
              navigation.navigate("Regiment Selection", {
                loginData: loginData,
              });
            }}
          >
            <Text style={styles.returnButtonFont2}>Workout Selection</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </>
  );
}

function SelectionScreen({ navigation, route }) {
  let { loginData } = route.params;

  //useStates which check if a new user has made a regiment or set goals, keeps them from launching a wokrout if true
  let [madeReg, updateMadeReg] = useState(true);
  let [madeGoals, updateMadeGoals] = useState(true);

  //useEffects check if a user has created goals and/or a regiment
  useEffect(() => {
    if (loginData[0].usrRegiment.length != 0) {
      updateMadeReg(false);
    } else {
      console.log("current user has made no regiment");
    }
    if (loginData[0].usrGoals[0].length != 0) {
      updateMadeGoals(false);
    } else {
      console.log("current user has not set any goals");
    }
  });

  return (
    <>
      <View style={styles.container}>
        <View style={styles.buttonGroup2}>
          <Pressable
            style={
              madeReg || madeGoals
                ? styles.listButtonDisabledTop
                : styles.listButtonTop
            }
            disabled={madeReg || madeGoals}
            onPress={() => {
              navigation.navigate("Workout", { loginData: loginData });
            }}
          >
            <Text style={styles.listButtonFont}>Begin Custom Workout</Text>
          </Pressable>
          <Pressable
            style={madeReg ? styles.listButtonDisabled : styles.listButton}
            disabled={madeReg}
            onPress={() => {
              navigation.navigate("Goals", { loginData: loginData });
            }}
          >
            <Text style={styles.listButtonFont}>
              {madeGoals ? "Set Goals" : "View Goals"}
            </Text>
          </Pressable>
          <Pressable
            style={styles.listButton}
            onPress={() => {
              navigation.navigate("Regiment Editor", { loginData: loginData });
            }}
          >
            <Text style={styles.listButtonFont}>
              {madeReg ? "Create Regiment" : "Edit Regiment"}
            </Text>
          </Pressable>
          <Pressable
            style={styles.returnButton2}
            onPress={() => {
              navigation.navigate("Login");
            }}
          >
            <Text style={styles.returnButtonFont}>Log Out</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

function GoalsScreen({ navigation, route }) {
  let { loginData } = route.params;

  //destructuring each set of Goals and Maxes stored as array's in loginData
  let usrPushGoals = loginData[0].usrGoals[0];
  let usrPullGoals = loginData[0].usrGoals[1];
  let usrLegGoals = loginData[0].usrGoals[2];
  let usrShoGoals = loginData[0].usrGoals[3];

  let usrPushMaxes = loginData[0].usrMaxes[0];
  let usrPullMaxes = loginData[0].usrMaxes[1];
  let usrLegMaxes = loginData[0].usrMaxes[2];
  let usrShoMaxes = loginData[0].usrMaxes[3];

  //each useState stores the user's entered goal for given exercise
  let [goal1, setGoal1] = useState();
  let [goal2, setGoal2] = useState();
  let [goal3, setGoal3] = useState();

  //states maintaining which the user's current goals are displayed (push, pull, legs,or shoulders) as well as the exercises within each group
  let [dispGoals, setDispGoals] = useState([]);
  let [dispMaxes, setDispMaxes] = useState([]);
  let [dispExercise, setDispExercise] = useState([]);
  let [curGroup, setCurGroup] = useState("No Group Selected");

  let [gate, openGate] = useState(true);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.goalsInputGroup}>
          <Text style={styles.instruction}>
            Select a group to view and edit.
          </Text>
          <View style={styles.buttonGroup1}>
            <Pressable
              style={styles.button}
              onPress={() => {
                setCurGroup("Save Push Workout Goals");
                setDispGoals(usrPushGoals);
                setDispMaxes(usrPushMaxes);
                setDispExercise([
                  "Incline Benchpress",
                  "Flat Benchpress",
                  "Chest Flys",
                ]);
                setGoal1(0);
                setGoal2(0);
                setGoal3(0);
                openGate(false);
              }}
            >
              <Text style={styles.buttonFont}>Push</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => {
                setCurGroup("Save Pull Workout Goals");
                setDispGoals(usrPullGoals);
                setDispMaxes(usrPullMaxes);
                setDispExercise([
                  "Barbell Rows",
                  "Lat Pull Down",
                  "Cable Rows",
                ]);
                setGoal1(0);
                setGoal2(0);
                setGoal3(0);
                openGate(false);
              }}
            >
              <Text style={styles.buttonFont}>Pull</Text>
            </Pressable>
          </View>
          <View style={styles.buttonGroup1}>
            <Pressable
              style={styles.button}
              onPress={() => {
                setCurGroup("Save Leg Workout Goals");
                setDispGoals(usrLegGoals);
                setDispMaxes(usrLegMaxes);
                setDispExercise(["Front Squat", "Back Squat", "Deadlift"]);
                setGoal1(0);
                setGoal2(0);
                setGoal3(0);
                openGate(false);
              }}
            >
              <Text style={styles.buttonFont}>Legs</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => {
                setCurGroup("Save Shoulder Workout Goals");
                setDispGoals(usrShoGoals);
                setDispMaxes(usrShoMaxes);
                setDispExercise([
                  "Lateral Raise",
                  "Overhead Press",
                  "Face Pulls",
                ]);
                setGoal1(0);
                setGoal2(0);
                setGoal3(0);
                openGate(false);
              }}
            >
              <Text style={styles.buttonFont}>Shoulders</Text>
            </Pressable>
          </View>
          <Text style={styles.label}>{dispExercise[0]}</Text>
          <View style={styles.goalsGroup}>
            <Text style={styles.goalsText}>
              Max -
              <Text style={{ fontWeight: "bold" }}>{dispMaxes[0]}lbs.</Text>
            </Text>
            <Text style={styles.goalsText}>
              Goal -
              <Text style={{ fontWeight: "bold" }}>{dispGoals[0]}lbs.</Text>
            </Text>
          </View>
          <TextInput
            style={styles.goalsInput}
            onChangeText={setGoal1}
          ></TextInput>
          <Text style={styles.label}>{dispExercise[1]}</Text>
          <View style={styles.goalsGroup}>
            <Text style={styles.goalsText}>
              Max -
              <Text style={{ fontWeight: "bold" }}>{dispMaxes[1]}lbs.</Text>
            </Text>
            <Text style={styles.goalsText}>
              Goal -
              <Text style={{ fontWeight: "bold" }}>{dispGoals[1]}lbs.</Text>
            </Text>
          </View>
          <TextInput
            style={styles.goalsInput}
            onChangeText={setGoal2}
          ></TextInput>
          <Text style={styles.label}>{dispExercise[2]}</Text>
          <View style={styles.goalsGroup}>
            <Text style={styles.goalsText}>
              Max -
              <Text style={{ fontWeight: "bold" }}>{dispMaxes[2]}lbs.</Text>
            </Text>
            <Text style={styles.goalsText}>
              Goal -
              <Text style={{ fontWeight: "bold" }}>{dispGoals[2]}lbs.</Text>
            </Text>
          </View>
          <TextInput
            style={styles.goalsInput}
            onChangeText={setGoal3}
          ></TextInput>
        </View>
        <View style={styles.buttonGroup1}>
          <Pressable
            style={styles.saveButton}
            disabled={gate}
            onPress={() => {
              if (curGroup == "Save Push Workout Goals") {
                clearArray(loginData[0].usrGoals[0]);
                loginData[0].usrGoals[0].push(goal1, goal2, goal3);
              } else if (curGroup == "Save Pull Workout Goals") {
                clearArray(loginData[0].usrGoals[1]);
                loginData[0].usrGoals[1].push(goal1, goal2, goal3);
              } else if (curGroup == "Save Leg Workout Goals") {
                clearArray(loginData[0].usrGoals[2]);
                loginData[0].usrGoals[2].push(goal1, goal2, goal3);
              } else if (curGroup == "Save Shoulder Workout Goals") {
                clearArray(loginData[0].usrGoals[3]);
                loginData[0].usrGoals[3].push(goal1, goal2, goal3);
              }
              openGate(true);
            }}
          >
            <Text style={styles.saveButtonFont}>{curGroup}</Text>
          </Pressable>
          <Pressable
            style={styles.returnButton3}
            onPress={() => {
              navigation.navigate("Regiment Selection", {
                loginData: loginData,
              });
            }}
          >
            <Text style={styles.returnButtonFont2}>Workout Selection</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

function CurrentExerciseScreen({ navigation, route }) {
  let { loginData } = route.params;

  //similar destructuring as in GoalsScreen
  let usrPushGoals = loginData[0].usrGoals[0];
  let usrPullGoals = loginData[0].usrGoals[1];
  let usrLegGoals = loginData[0].usrGoals[2];
  let usrShoGoals = loginData[0].usrGoals[3];

  let usrPushMaxes = loginData[0].usrMaxes[0];
  let usrPullMaxes = loginData[0].usrMaxes[1];
  let usrLegMaxes = loginData[0].usrMaxes[2];
  let usrShoMaxes = loginData[0].usrMaxes[3];

  let [reps, setReps] = useState(0);

  let usrReg = loginData[0].usrRegiment;
  const d = new Date();
  let day = d.getDay();
  let regIndex = usrReg[0][day];

  //each useState tracks the weight a given user has entered for given exercise in the order
  let [curWeight1, setCurWeight1] = useState();
  let [curWeight2, setCurWeight2] = useState();
  let [curWeight3, setCurWeight3] = useState();

  let newMax1;
  let newMax2;
  let newMax3;

  switch (regIndex) {
    case 0:
      const pushUps = 0;
      const inclineBench = 1;
      const flatBench = 2;
      const chestFly = 3;
      let [curPush, setCurPush] = useState(pushUps);

      if (curPush === pushUps) {
        return (
          <>
            <View style={styles.container}>
              <Text style={styles.instruction}>
                Warmp up your push group with some Push Ups.
              </Text>
              <View style={styles.counterGroup}>
                <Text style={styles.counter}>{reps}</Text>
                <View style={styles.buttonGroup1}>
                  <Pressable
                    style={styles.rep1Button}
                    onPress={() => {
                      setReps(reps + 1);
                    }}
                  >
                    <Text style={styles.rep1ButtonFont}>+1 Rep</Text>
                  </Pressable>
                  <Pressable
                    style={styles.rep0Button}
                    onPress={() => {
                      setReps((reps = 0));
                    }}
                  >
                    <Text style={styles.rep0ButtonFont}>Set Reps to 0</Text>
                  </Pressable>
                </View>
                <Pressable
                  style={styles.nextButton}
                  onPress={() => {
                    setCurPush(inclineBench);
                    setReps((reps = 0));
                  }}
                >
                  <Text style={styles.nextButtonFont}>Next Exercise</Text>
                </Pressable>
              </View>
              <Pressable
                style={styles.returnButton4}
                onPress={() => {
                  navigation.navigate("Regiment Selection", {
                    loginData: loginData,
                  });
                }}
              >
                <Text style={styles.returnButtonFont3}>
                  Return to Workout Selection
                </Text>
              </Pressable>
            </View>
          </>
        );
      } else if (curPush === inclineBench) {
        return (
          <>
            <View style={styles.container}>
              <Text style={styles.instruction}>
                Exercise 1: Incline Benchpress
              </Text>
              <View style={styles.counterGroup}>
                <TextInput
                  style={styles.weightInput}
                  placeholder="press to add weight"
                  onChangeText={setCurWeight1}
                ></TextInput>
                <Text style={styles.goalsText}>
                  Current Goal:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {usrPushGoals[0]}lbs.
                  </Text>
                </Text>
                <Text style={styles.goalsText}>
                  Previous Max:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {usrPushMaxes[0]}lbs.
                  </Text>
                </Text>
                <Text style={styles.counter}>{reps}</Text>
                <View style={styles.buttonGroup1}>
                  <Pressable
                    style={styles.rep1Button}
                    onPress={() => {
                      setReps(reps + 1);
                    }}
                  >
                    <Text style={styles.rep1ButtonFont}>+1 Rep</Text>
                  </Pressable>
                  <Pressable
                    style={styles.rep0Button}
                    onPress={() => {
                      setReps((reps = 0));
                    }}
                  >
                    <Text style={styles.rep0ButtonFont}>Set Reps to 0</Text>
                  </Pressable>
                </View>
                <Pressable
                  style={styles.nextButton}
                  onPress={() => {
                    setCurPush(flatBench);
                    setReps((reps = 0));
                  }}
                >
                  <Text style={styles.nextButtonFont}>Next Exercise</Text>
                </Pressable>
              </View>
              <Pressable
                style={styles.returnButton4}
                onPress={() => {
                  navigation.navigate("Regiment Selection", {
                    loginData: loginData,
                  });
                }}
              >
                <Text style={styles.returnButtonFont3}>
                  Return to Workout Selection
                </Text>
              </Pressable>
            </View>
          </>
        );
      } else if (curPush === flatBench) {
        return (
          <>
            <View style={styles.container}>
              <Text style={styles.instruction}>
                Exercise 2: Flat Benchpress
              </Text>
              <View style={styles.counterGroup}>
                <TextInput
                  style={styles.weightInput}
                  placeholder="press to add weight"
                  onChangeText={setCurWeight2}
                ></TextInput>
                <Text style={styles.goalsText}>
                  Current Goal:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {usrPushGoals[1]}lbs.
                  </Text>
                </Text>
                <Text style={styles.goalsText}>
                  Previous Max:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {usrPushMaxes[1]}lbs.
                  </Text>
                </Text>
                <Text style={styles.counter}>{reps}</Text>
                <View style={styles.buttonGroup1}>
                  <Pressable
                    style={styles.rep1Button}
                    onPress={() => {
                      setReps(reps + 1);
                    }}
                  >
                    <Text style={styles.rep1ButtonFont}>+1 Rep</Text>
                  </Pressable>
                  <Pressable
                    style={styles.rep0Button}
                    onPress={() => {
                      setReps((reps = 0));
                    }}
                  >
                    <Text style={styles.rep0ButtonFont}>Set Reps to 0</Text>
                  </Pressable>
                </View>
                <Pressable
                  style={styles.nextButton}
                  onPress={() => {
                    setCurPush(chestFly);
                    setReps((reps = 0));
                  }}
                >
                  <Text style={styles.nextButtonFont}>Next Exercise</Text>
                </Pressable>
              </View>
              <Pressable
                style={styles.returnButton4}
                onPress={() => {
                  navigation.navigate("Regiment Selection", {
                    loginData: loginData,
                  });
                }}
              >
                <Text style={styles.returnButtonFont3}>
                  Return to Workout Selection
                </Text>
              </Pressable>
            </View>
          </>
        );
      } else if (curPush === chestFly) {
        return (
          <>
            <View style={styles.container}>
              <Text style={styles.instruction}>Exercise 3: Chest Flys</Text>
              <View style={styles.counterGroup}>
                <TextInput
                  style={styles.weightInput}
                  placeholder="press to add weight"
                  onChangeText={setCurWeight3}
                ></TextInput>
                <Text style={styles.goalsText}>
                  Current Goal:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {usrPushGoals[2]}lbs.
                  </Text>
                </Text>
                <Text style={styles.goalsText}>
                  Previous Max:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {usrPushMaxes[2]}lbs.
                  </Text>
                </Text>
                <Text style={styles.counter}>{reps}</Text>
                <View style={styles.buttonGroup1}>
                  <Pressable
                    style={styles.rep1Button}
                    onPress={() => {
                      setReps(reps + 1);
                    }}
                  >
                    <Text style={styles.rep1ButtonFont}>+1 Rep</Text>
                  </Pressable>
                  <Pressable
                    style={styles.rep0Button}
                    onPress={() => {
                      setReps((reps = 0));
                    }}
                  >
                    <Text style={styles.rep0ButtonFont}>Set Reps to 0</Text>
                  </Pressable>
                </View>
                <Pressable
                  style={styles.nextButton}
                  onPress={() => {
                    setReps((reps = 0));
                    if (Number(curWeight3) > Number(usrPushMaxes[2])) {
                      newMax3 = curWeight3;
                      console.log("new max achieved!");
                    } else {
                      newMax3 = usrPushMaxes[2];
                      console.log("almost there");
                    }
                    if (Number(curWeight2) > Number(usrPushMaxes[1])) {
                      newMax2 = curWeight2;
                      console.log("new max achieved!");
                    } else {
                      newMax2 = usrPushMaxes[1];
                      console.log("almost there");
                    }
                    if (Number(curWeight1) > Number(usrPushMaxes[0])) {
                      newMax1 = curWeight1;
                      console.log("new max achieved!");
                    } else {
                      newMax1 = usrPushMaxes[0];
                      console.log("almost there");
                    }
                    clearArray(loginData[0].usrMaxes[0]);
                    loginData[0].usrMaxes[0].push(newMax1);
                    loginData[0].usrMaxes[0].push(newMax2);
                    loginData[0].usrMaxes[0].push(newMax3);

                    navigation.navigate("Regiment Selection", {
                      loginData: loginData,
                    });
                  }}
                >
                  <Text style={styles.nextButtonFont}>Complete Workout</Text>
                </Pressable>
              </View>
            </View>
          </>
        );
      }
    case 1:
      const pullUps = 0;
      const barbellRows = 1;
      const pullDowns = 2;
      const cableRows = 3;
      let [curPull, setCurPull] = useState(pullUps);

      if (curPull === pullUps) {
        return (
          <>
            <View style={styles.container}>
              <Text style={styles.instruction}>
                Warmp up your pull group with some Pull Ups.
              </Text>
              <View style={styles.counterGroup}>
                <Text style={styles.counter}>{reps}</Text>
                <View style={styles.buttonGroup1}>
                  <Pressable
                    style={styles.rep1Button}
                    onPress={() => {
                      setReps(reps + 1);
                    }}
                  >
                    <Text style={styles.rep1ButtonFont}>+1 Rep</Text>
                  </Pressable>
                  <Pressable
                    style={styles.rep0Button}
                    onPress={() => {
                      setReps((reps = 0));
                    }}
                  >
                    <Text style={styles.rep0ButtonFont}>Set Reps to 0</Text>
                  </Pressable>
                </View>
                <Pressable
                  style={styles.nextButton}
                  onPress={() => {
                    setCurPull(barbellRows);
                    setReps((reps = 0));
                  }}
                >
                  <Text style={styles.nextButtonFont}>Next Exercise</Text>
                </Pressable>
              </View>
              <Pressable
                style={styles.returnButton4}
                onPress={() => {
                  navigation.navigate("Regiment Selection", {
                    loginData: loginData,
                  });
                }}
              >
                <Text style={styles.returnButtonFont3}>
                  Return to Workout Selection
                </Text>
              </Pressable>
            </View>
          </>
        );
      } else if (curPull === barbellRows) {
        return (
          <>
            <View style={styles.container}>
              <Text style={styles.instruction}>Exercise 1: Barbell Rows</Text>
              <View style={styles.counterGroup}>
                <TextInput
                  style={styles.weightInput}
                  placeholder="press to add weight"
                  onChangeText={setCurWeight1}
                ></TextInput>
                <Text style={styles.goalsText}>
                  Current Goal:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {usrPullGoals[0]}lbs.
                  </Text>
                </Text>
                <Text style={styles.goalsText}>
                  Previous Max:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {usrPullMaxes[0]}lbs.
                  </Text>
                </Text>
                <Text style={styles.counter}>{reps}</Text>
                <View style={styles.buttonGroup1}>
                  <Pressable
                    style={styles.rep1Button}
                    onPress={() => {
                      setReps(reps + 1);
                    }}
                  >
                    <Text style={styles.rep1ButtonFont}>+1 Rep</Text>
                  </Pressable>
                  <Pressable
                    style={styles.rep0Button}
                    onPress={() => {
                      setReps((reps = 0));
                    }}
                  >
                    <Text style={styles.rep0ButtonFont}>Set Reps to 0</Text>
                  </Pressable>
                </View>
                <Pressable
                  style={styles.nextButton}
                  onPress={() => {
                    setCurPull(pullDowns);
                    setReps((reps = 0));
                  }}
                >
                  <Text style={styles.nextButtonFont}>Next Exercise</Text>
                </Pressable>
              </View>
              <Pressable
                style={styles.returnButton4}
                onPress={() => {
                  navigation.navigate("Regiment Selection", {
                    loginData: loginData,
                  });
                }}
              >
                <Text style={styles.returnButtonFont3}>
                  Return to Workout Selection
                </Text>
              </Pressable>
            </View>
          </>
        );
      } else if (curPull === pullDowns) {
        return (
          <>
            <View style={styles.container}>
              <Text style={styles.instruction}>Exercise 2: Lat Pull Downs</Text>
              <View style={styles.counterGroup}>
                <TextInput
                  style={styles.weightInput}
                  placeholder="press to add weight"
                  onChangeText={setCurWeight2}
                ></TextInput>
                <Text style={styles.goalsText}>
                  Current Goal:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {usrPullGoals[1]}lbs.
                  </Text>
                </Text>
                <Text style={styles.goalsText}>
                  Previous Max:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {usrPullMaxes[1]}lbs.
                  </Text>
                </Text>
                <Text style={styles.counter}>{reps}</Text>
                <View style={styles.buttonGroup1}>
                  <Pressable
                    style={styles.rep1Button}
                    onPress={() => {
                      setReps(reps + 1);
                    }}
                  >
                    <Text style={styles.rep1ButtonFont}>+1 Rep</Text>
                  </Pressable>
                  <Pressable
                    style={styles.rep0Button}
                    onPress={() => {
                      setReps((reps = 0));
                    }}
                  >
                    <Text style={styles.rep0ButtonFont}>Set Reps to 0</Text>
                  </Pressable>
                </View>
                <Pressable
                  style={styles.nextButton}
                  onPress={() => {
                    setCurPull(cableRows);
                    setReps((reps = 0));
                  }}
                >
                  <Text style={styles.nextButtonFont}>Next Exercise</Text>
                </Pressable>
              </View>
              <Pressable
                style={styles.returnButton4}
                onPress={() => {
                  navigation.navigate("Regiment Selection", {
                    loginData: loginData,
                  });
                }}
              >
                <Text style={styles.returnButtonFont3}>
                  Return to Workout Selection
                </Text>
              </Pressable>
            </View>
          </>
        );
      } else if (curPull === cableRows) {
        return (
          <>
            <View style={styles.container}>
              <Text style={styles.instruction}>Exercise 3: Cable Rows</Text>
              <View style={styles.counterGroup}>
                <TextInput
                  style={styles.weightInput}
                  placeholder="press to add weight"
                  onChangeText={setCurWeight3}
                ></TextInput>
                <Text style={styles.goalsText}>
                  Current Goal:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {usrPullGoals[2]}lbs.
                  </Text>
                </Text>
                <Text style={styles.goalsText}>
                  Previous Max:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {usrPullMaxes[2]}lbs.
                  </Text>
                </Text>
                <Text style={styles.counter}>{reps}</Text>
                <View style={styles.buttonGroup1}>
                  <Pressable
                    style={styles.rep1Button}
                    onPress={() => {
                      setReps(reps + 1);
                    }}
                  >
                    <Text style={styles.rep1ButtonFont}>+1 Rep</Text>
                  </Pressable>
                  <Pressable
                    style={styles.rep0Button}
                    onPress={() => {
                      setReps((reps = 0));
                    }}
                  >
                    <Text style={styles.rep0ButtonFont}>Set Reps to 0</Text>
                  </Pressable>
                </View>
                <Pressable
                  style={styles.nextButton}
                  onPress={() => {
                    setReps((reps = 0));
                    if (Number(curWeight3) > Number(usrPullMaxes[2])) {
                      newMax3 = curWeight3;
                      console.log("new max achieved!");
                    } else {
                      newMax3 = usrPullMaxes[2];
                      console.log("almost there");
                    }
                    if (Number(curWeight2) > Number(usrPullMaxes[1])) {
                      newMax2 = curWeight2;
                      console.log("new max achieved!");
                    } else {
                      newMax2 = usrPullMaxes[1];
                      console.log("almost there");
                    }
                    if (Number(curWeight1) > Number(usrPullMaxes[0])) {
                      newMax1 = curWeight1;
                      console.log("new max achieved!");
                    } else {
                      newMax1 = usrPullMaxes[0];
                      console.log("almost there");
                    }
                    clearArray(loginData[0].usrMaxes[1]);
                    loginData[0].usrMaxes[1].push(newMax3);
                    loginData[0].usrMaxes[1].push(newMax2);
                    loginData[0].usrMaxes[1].push(newMax1);

                    navigation.navigate("Regiment Selection", {
                      loginData: loginData,
                    });
                  }}
                >
                  <Text style={styles.nextButtonFont}>Complete Workout</Text>
                </Pressable>
              </View>
            </View>
          </>
        );
      }
    case 2:
      const lunges = 0;
      const frontSquats = 1;
      const backSquats = 2;
      const deadlifts = 3;
      let [curLegs, setCurLegs] = useState(lunges);

      if (curLegs === lunges) {
        return (
          <>
            <View style={styles.container}>
              <Text style={styles.instruction}>
                Warmp up your legs with some Lunges.
              </Text>
              <View style={styles.counterGroup}>
                <Text style={styles.counter}>{reps}</Text>
                <View style={styles.buttonGroup1}>
                  <Pressable
                    style={styles.rep1Button}
                    onPress={() => {
                      setReps(reps + 1);
                    }}
                  >
                    <Text style={styles.rep1ButtonFont}>+1 Rep</Text>
                  </Pressable>
                  <Pressable
                    style={styles.rep0Button}
                    onPress={() => {
                      setReps((reps = 0));
                    }}
                  >
                    <Text style={styles.rep0ButtonFont}>Set Reps to 0</Text>
                  </Pressable>
                </View>
                <Pressable
                  style={styles.nextButton}
                  onPress={() => {
                    setCurLegs(frontSquats);
                    setReps((reps = 0));
                  }}
                >
                  <Text style={styles.nextButtonFont}>Next Exercise</Text>
                </Pressable>
              </View>
              <Pressable
                style={styles.returnButton4}
                onPress={() => {
                  navigation.navigate("Regiment Selection", {
                    loginData: loginData,
                  });
                }}
              >
                <Text style={styles.returnButtonFont3}>
                  Return to Workout Selection
                </Text>
              </Pressable>
            </View>
          </>
        );
      } else if (curLegs === frontSquats) {
        return (
          <>
            <View style={styles.container}>
              <Text style={styles.instruction}>Exercise 1: Front Squats</Text>
              <View style={styles.counterGroup}>
                <TextInput
                  style={styles.weightInput}
                  placeholder="press to add weight"
                  onChangeText={setCurWeight1}
                ></TextInput>
                <Text style={styles.goalsText}>
                  Current Goal:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {usrLegGoals[0]}lbs.
                  </Text>
                </Text>
                <Text style={styles.goalsText}>
                  Previous Max:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {usrLegMaxes[0]}lbs.
                  </Text>
                </Text>
                <Text style={styles.counter}>{reps}</Text>
                <View style={styles.buttonGroup1}>
                  <Pressable
                    style={styles.rep1Button}
                    onPress={() => {
                      setReps(reps + 1);
                    }}
                  >
                    <Text style={styles.rep1ButtonFont}>+1 Rep</Text>
                  </Pressable>
                  <Pressable
                    style={styles.rep0Button}
                    onPress={() => {
                      setReps((reps = 0));
                    }}
                  >
                    <Text style={styles.rep0ButtonFont}>Set Reps to 0</Text>
                  </Pressable>
                </View>
                <Pressable
                  style={styles.nextButton}
                  onPress={() => {
                    setCurLegs(backSquats);
                    setReps((reps = 0));
                  }}
                >
                  <Text style={styles.nextButtonFont}>Next Exercise</Text>
                </Pressable>
              </View>
              <Pressable
                style={styles.returnButton4}
                onPress={() => {
                  navigation.navigate("Regiment Selection", {
                    loginData: loginData,
                  });
                }}
              >
                <Text style={styles.returnButtonFont3}>
                  Return to Workout Selection
                </Text>
              </Pressable>
            </View>
          </>
        );
      } else if (curLegs === backSquats) {
        return (
          <>
            <View style={styles.container}>
              <Text style={styles.instruction}>Exercise 2: Back Squats</Text>
              <View style={styles.counterGroup}>
                <TextInput
                  style={styles.weightInput}
                  placeholder="press to add weight"
                  onChangeText={setCurWeight2}
                ></TextInput>
                <Text style={styles.goalsText}>
                  Current Goal:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {usrLegGoals[1]}lbs.
                  </Text>
                </Text>
                <Text style={styles.goalsText}>
                  Previous Max:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {usrLegMaxes[1]}lbs.
                  </Text>
                </Text>
                <Text style={styles.counter}>{reps}</Text>
                <View style={styles.buttonGroup1}>
                  <Pressable
                    style={styles.rep1Button}
                    onPress={() => {
                      setReps(reps + 1);
                    }}
                  >
                    <Text style={styles.rep1ButtonFont}>+1 Rep</Text>
                  </Pressable>
                  <Pressable
                    style={styles.rep0Button}
                    onPress={() => {
                      setReps((reps = 0));
                    }}
                  >
                    <Text style={styles.rep0ButtonFont}>Set Reps to 0</Text>
                  </Pressable>
                </View>
                <Pressable
                  style={styles.nextButton}
                  onPress={() => {
                    setCurLegs(deadlifts);
                    setReps((reps = 0));
                  }}
                >
                  <Text style={styles.nextButtonFont}>Next Exercise</Text>
                </Pressable>
              </View>
              <Pressable
                style={styles.returnButton4}
                onPress={() => {
                  navigation.navigate("Regiment Selection", {
                    loginData: loginData,
                  });
                }}
              >
                <Text style={styles.returnButtonFont3}>
                  Return to Workout Selection
                </Text>
              </Pressable>
            </View>
          </>
        );
      } else if (curLegs === deadlifts) {
        return (
          <>
            <View style={styles.container}>
              <Text style={styles.instruction}>Exercise 3: Deadlifts</Text>
              <View style={styles.counterGroup}>
                <TextInput
                  style={styles.weightInput}
                  placeholder="press to add weight"
                  onChangeText={setCurWeight3}
                ></TextInput>
                <Text style={styles.goalsText}>
                  Current Goal:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {usrLegGoals[2]}lbs.
                  </Text>
                </Text>
                <Text style={styles.goalsText}>
                  Previous Max:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {usrLegMaxes[2]}lbs.
                  </Text>
                </Text>
                <Text style={styles.counter}>{reps}</Text>
                <View style={styles.buttonGroup1}>
                  <Pressable
                    style={styles.rep1Button}
                    onPress={() => {
                      setReps(reps + 1);
                    }}
                  >
                    <Text style={styles.rep1ButtonFont}>+1 Rep</Text>
                  </Pressable>
                  <Pressable
                    style={styles.rep0Button}
                    onPress={() => {
                      setReps((reps = 0));
                    }}
                  >
                    <Text style={styles.rep0ButtonFont}>Set Reps to 0</Text>
                  </Pressable>
                </View>
                <Pressable
                  style={styles.nextButton}
                  onPress={() => {
                    setReps((reps = 0));
                    if (Number(curWeight3) > Number(usrLegMaxes[2])) {
                      newMax3 = curWeight3;
                      console.log("new max achieved!");
                    } else {
                      newMax3 = usrLegMaxes[2];
                      console.log("almost there");
                    }
                    if (Number(curWeight2) > Number(usrLegMaxes[1])) {
                      newMax2 = curWeight2;
                      console.log("new max achieved!");
                    } else {
                      newMax2 = usrLegMaxes[1];
                      console.log("almost there");
                    }
                    if (Number(curWeight1) > Number(usrLegMaxes[0])) {
                      newMax1 = curWeight1;
                      console.log("new max achieved!");
                    } else {
                      newMax1 = usrLegMaxes[0];
                      console.log("almost there");
                    }
                    clearArray(loginData[0].usrMaxes[2]);
                    loginData[0].usrMaxes[2].push(newMax1);
                    loginData[0].usrMaxes[2].push(newMax2);
                    loginData[0].usrMaxes[2].push(newMax3);

                    navigation.navigate("Regiment Selection", {
                      loginData: loginData,
                    });
                  }}
                >
                  <Text style={styles.nextButtonFont}>Complete Workout</Text>
                </Pressable>
              </View>
            </View>
          </>
        );
      }
    case 3:
      const teaCups = 0;
      const sideRaise = 1;
      const ohPress = 2;
      const facePulls = 3;
      let [curShoul, setCurShoul] = useState(teaCups);

      if (curShoul === teaCups) {
        return (
          <>
            <View style={styles.container}>
              <Text style={styles.instruction}>
                Warmp up your shoulders with some Teacups.
              </Text>
              <View style={styles.counterGroup}>
                <Text style={styles.counter}>{reps}</Text>
                <View style={styles.buttonGroup1}>
                  <Pressable
                    style={styles.rep1Button}
                    onPress={() => {
                      setReps(reps + 1);
                    }}
                  >
                    <Text style={styles.rep1ButtonFont}>+1 Rep</Text>
                  </Pressable>
                  <Pressable
                    style={styles.rep0Button}
                    onPress={() => {
                      setReps((reps = 0));
                    }}
                  >
                    <Text style={styles.rep0ButtonFont}>Set Reps to 0</Text>
                  </Pressable>
                </View>
                <Pressable
                  style={styles.nextButton}
                  onPress={() => {
                    setCurShoul(sideRaise);
                    setReps((reps = 0));
                  }}
                >
                  <Text style={styles.nextButtonFont}>Next Exercise</Text>
                </Pressable>
              </View>
              <Pressable
                style={styles.returnButton4}
                onPress={() => {
                  navigation.navigate("Regiment Selection", {
                    loginData: loginData,
                  });
                }}
              >
                <Text style={styles.returnButtonFont3}>
                  Return to Workout Selection
                </Text>
              </Pressable>
            </View>
          </>
        );
      } else if (curShoul === sideRaise) {
        return (
          <>
            <View style={styles.container}>
              <Text style={styles.instruction}>Exercise 1: Side Raises</Text>
              <View style={styles.counterGroup}>
                <TextInput
                  style={styles.weightInput}
                  placeholder="press to add weight"
                  onChangeText={setCurWeight1}
                ></TextInput>
                <Text style={styles.goalsText}>
                  Current Goal:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {usrShoGoals[0]}lbs.
                  </Text>
                </Text>
                <Text style={styles.goalsText}>
                  Previous Max:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {usrShoMaxes[0]}lbs.
                  </Text>
                </Text>
                <Text style={styles.counter}>{reps}</Text>
                <View style={styles.buttonGroup1}>
                  <Pressable
                    style={styles.rep1Button}
                    onPress={() => {
                      setReps(reps + 1);
                    }}
                  >
                    <Text style={styles.rep1ButtonFont}>+1 Rep</Text>
                  </Pressable>
                  <Pressable
                    style={styles.rep0Button}
                    onPress={() => {
                      setReps((reps = 0));
                    }}
                  >
                    <Text style={styles.rep0ButtonFont}>Set Reps to 0</Text>
                  </Pressable>
                </View>
                <Pressable
                  style={styles.nextButton}
                  onPress={() => {
                    setCurShoul(ohPress);
                    setReps((reps = 0));
                  }}
                >
                  <Text style={styles.nextButtonFont}>Next Exercise</Text>
                </Pressable>
              </View>
              <Pressable
                style={styles.returnButton4}
                onPress={() => {
                  navigation.navigate("Regiment Selection", {
                    loginData: loginData,
                  });
                }}
              >
                <Text style={styles.returnButtonFont3}>
                  Return to Workout Selection
                </Text>
              </Pressable>
            </View>
          </>
        );
      } else if (curShoul === ohPress) {
        return (
          <>
            <View style={styles.container}>
              <Text style={styles.instruction}>Exercise 2: Overhead Press</Text>
              <View style={styles.counterGroup}>
                <TextInput
                  style={styles.weightInput}
                  placeholder="press to add weight"
                  onChangeText={setCurWeight2}
                ></TextInput>
                <Text style={styles.goalsText}>
                  Current Goal:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {usrShoGoals[1]}lbs.
                  </Text>
                </Text>
                <Text style={styles.goalsText}>
                  Previous Max:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {usrShoMaxes[1]}lbs.
                  </Text>
                </Text>
                <Text style={styles.counter}>{reps}</Text>
                <View style={styles.buttonGroup1}>
                  <Pressable
                    style={styles.rep1Button}
                    onPress={() => {
                      setReps(reps + 1);
                    }}
                  >
                    <Text style={styles.rep1ButtonFont}>+1 Rep</Text>
                  </Pressable>
                  <Pressable
                    style={styles.rep0Button}
                    onPress={() => {
                      setReps((reps = 0));
                    }}
                  >
                    <Text style={styles.rep0ButtonFont}>Set Reps to 0</Text>
                  </Pressable>
                </View>
                <Pressable
                  style={styles.nextButton}
                  onPress={() => {
                    setCurShoul(facePulls);
                    setReps((reps = 0));
                  }}
                >
                  <Text style={styles.nextButtonFont}>Next Exercise</Text>
                </Pressable>
              </View>
              <Pressable
                style={styles.returnButton4}
                onPress={() => {
                  navigation.navigate("Regiment Selection", {
                    loginData: loginData,
                  });
                }}
              >
                <Text style={styles.returnButtonFont3}>
                  Return to Workout Selection
                </Text>
              </Pressable>
            </View>
          </>
        );
      } else if (curShoul === facePulls) {
        return (
          <>
            <View style={styles.container}>
              <Text style={styles.instruction}>Exercise 3: Face Pulls</Text>
              <View style={styles.counterGroup}>
                <TextInput
                  style={styles.weightInput}
                  placeholder="press to add weight"
                  onChangeText={setCurWeight3}
                ></TextInput>
                <Text style={styles.goalsText}>
                  Current Goal:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {usrShoGoals[2]}lbs.
                  </Text>
                </Text>
                <Text style={styles.goalsText}>
                  Previous Max:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {usrShoMaxes[2]}lbs.
                  </Text>
                </Text>
                <Text style={styles.counter}>{reps}</Text>
                <View style={styles.buttonGroup1}>
                  <Pressable
                    style={styles.rep1Button}
                    onPress={() => {
                      setReps(reps + 1);
                    }}
                  >
                    <Text style={styles.rep1ButtonFont}>+1 Rep</Text>
                  </Pressable>
                  <Pressable
                    style={styles.rep0Button}
                    onPress={() => {
                      setReps((reps = 0));
                    }}
                  >
                    <Text style={styles.rep0ButtonFont}>Set Reps to 0</Text>
                  </Pressable>
                </View>
                <Pressable
                  style={styles.nextButton}
                  onPress={() => {
                    setReps((reps = 0));
                    if (Number(curWeight3) > Number(usrShoMaxes[2])) {
                      newMax3 = curWeight3;
                      console.log("new max achieved!");
                    } else {
                      newMax3 = usrShoMaxes[2];
                      console.log("almost there");
                    }
                    if (Number(curWeight2) > Number(usrShoMaxes[1])) {
                      newMax2 = curWeight2;
                      console.log("new max achieved!");
                    } else {
                      newMax2 = usrShoMaxes[1];
                      console.log("almost there");
                    }
                    if (Number(curWeight1) > Number(usrShoMaxes[0])) {
                      newMax1 = curWeight1;
                      console.log("new max achieved!");
                    } else {
                      newMax1 = usrShoMaxes[0];
                      console.log("almost there");
                    }
                    clearArray(loginData[0].usrMaxes[3]);
                    loginData[0].usrMaxes[3].push(newMax1);
                    loginData[0].usrMaxes[3].push(newMax2);
                    loginData[0].usrMaxes[3].push(newMax3);

                    navigation.navigate("Regiment Selection", {
                      loginData: loginData,
                    });
                  }}
                >
                  <Text style={styles.nextButtonFont}>Complete Workout</Text>
                </Pressable>
              </View>
            </View>
          </>
        );
      }
    case 4:
      return (
        <>
          <View style={styles.container}>
            <View style={styles.counterGroup}>
              <Text style={styles.instruction}>
                Looks like today is your Rest Day!
              </Text>
              <Text style={styles.label}>
                Keep your muscles in good condition with effective stretching
                and plenty of sleep!
              </Text>
              <Pressable
                onPress={() => {
                  navigation.navigate("Regiment Selection", {
                    loginData: loginData,
                  });
                }}
                style={styles.returnButton4}
              >
                <Text
                  style={{
                    fontSize: 30,
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Return to Workout Selection
                </Text>
              </Pressable>
            </View>
          </View>
        </>
      );
  }
}

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFC904",
  },
  container2: {
    backgroundColor: "#FFC904",
  },

  instruction: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    paddingBottom: 10,
    marginHorizontal: 5,
  },
  label: {
    fontSize: width * 0.065,
    fontWeight: "bold",
    paddingLeft: 20,
    paddingBottom: 2,
  },
  text: {
    width: width,
    fontSize: width * 0.07,
    textAlign: "center",
    paddingVertical: 5,
  },

  slider: {
    paddingVertical: 10,
    borderTopWidth: 3,
    borderBottomWidth: 3,
    backgroundColor: "white",
  },

  buttonGroup1: {
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonGroup2: {
    paddingVertical: width * 0.2,
    width: width * 0.7,
  },

  button: {
    width: width * 0.45,
    margin: 5,
    padding: 3,
    borderColor: "black",
    borderWidth: 1,
    textAlign: "center",
    backgroundColor: "#FFE278",
  },
  buttonFont: {
    fontSize: 30,
    fontWeight: "bold",
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
    color: "black",
    textAlign: "center",
  },

  returnButton: {
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: "black",
    borderWidth: 1,
    borderColor: "black",
    width: width * 0.4,
    padding: 10,
  },
  returnButton2: {
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: "black",
    borderWidth: 1,
    borderColor: "black",
    height: width * 0.2,
    marginTop: 10,
    justifyContent: "center",
  },
  returnButton3: {
    backgroundColor: "black",
    borderBottomRightRadius: 15,
    borderColor: "black",
    width: width * 0.5,
    justifyContent: "center",
  },
  returnButton4: {
    backgroundColor: "black",
    borderColor: "black",
    borderRadius: 15,
    width: width * 0.8,
    padding: 5,
    marginTop: 70,
  },
  returnButtonFont: {
    fontSize: 40,
    color: "white",
    textAlign: "center",
  },
  returnButtonFont2: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  returnButtonFont3: {
    fontSize: 30,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },

  disabledButton: {
    backgroundColor: "gray",
    borderBottomRightRadius: 15,
    borderColor: "black",
    borderWidth: 1,
    width: width * 0.5,
    justifyContent: "center",
  },

  saveButton: {
    backgroundColor: "#FFE278",
    borderBottomLeftRadius: 15,
    borderColor: "black",
    borderWidth: 1,
    width: width * 0.5,
    justifyContent: "center",
  },
  saveButtonFont: {
    margin: 7,
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },

  listButton: {
    justifyContent: "center",
    borderColor: "black",
    borderWidth: 1,
    height: width * 0.3,
    backgroundColor: "#FFE278",
  },
  listButtonTop: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    justifyContent: "center",
    borderColor: "black",
    borderWidth: 1,
    height: width * 0.3,
    backgroundColor: "#FFE278",
  },
  listButtonDisabled: {
    justifyContent: "center",
    backgroundColor: "white",
    borderWidth: 1,
    height: width * 0.3,
    borderColor: "black",
  },
  listButtonDisabledTop: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    justifyContent: "center",
    backgroundColor: "white",
    borderWidth: 1,
    height: width * 0.3,
    borderColor: "black",
  },
  listButtonFont: {
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
  },

  goalsGroup: {
    flexDirection: "row",
    justifyContent: "center",
  },
  goalsText: {
    fontSize: 27,
    paddingHorizontal: 5,
    paddingBottom: 5,
  },
  goalsInput: {
    alignSelf: "center",
    backgroundColor: "#FFE278",
    borderWidth: 1,
    width: width * 0.5,
    marginBottom: 10,
    fontSize: 40,
  },
  goalsInputGroup: {
    borderWidth: 3,
    borderColor: "black",
    backgroundColor: "white",
    padding: 10,
    paddingHorizontal: 30,
    borderRadius: 15,
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

  counter: {
    fontWeight: "bold",
    color: "white",
    fontSize: 50,
    backgroundColor: "black",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    width: width * 0.8,
    textAlign: "center",
  },
  counterGroup: {
    backgroundColor: "#FFE278",
    borderColor: "black",
    borderRadius: 15,
    borderWidth: 1,
    padding: 15,
  },

  rep1Button: {
    backgroundColor: "black",
    width: width * 0.4,
    justifyContent: "center",
  },
  rep1ButtonFont: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  rep0Button: {
    backgroundColor: "#FFC904",
    borderWidth: 1,
    width: width * 0.4,
    justifyContent: "center",
  },
  rep0ButtonFont: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },

  nextButton: {
    width: width * 0.8,
    borderWidth: 1,
    backgroundColor: "white",
    marginTop: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  nextButtonFont: {
    fontSize: 45,
    fontWeight: "bold",
    textAlign: "center",
  },

  weightInput: {
    alignSelf: "center",
    backgroundColor: "white",
    borderWidth: 1,
    width: width * 0.6,
    marginBottom: 10,
    fontSize: 25,
    textAlign: "center",
  },
});
