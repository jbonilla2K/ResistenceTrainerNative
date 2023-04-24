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
} from "react-native";
import { CheckBox, Input, Button } from "@rneui/themed";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native-web";
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
      <Stack.Navigator initialRouteName="Regiment Editor">
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
          <Input
            style={styles.input}
            placeholder="First Name"
            onChangeText={setFname}
            errorMessage={validateName(fName)}
          ></Input>
          <Input
            style={styles.input}
            placeholder="Last Name"
            onChangeText={setLname}
            errorMessage={validateName(lName)}
          ></Input>
          <Input
            style={styles.input}
            placeholder="Username"
            onChangeText={setUsername}
          ></Input>
          <Input
            style={styles.input}
            placeholder="Password"
            onChangeText={setPassword}
            errorMessage={validatePassword(password)}
          ></Input>
          <Input
            style={styles.input}
            placeholder="Confirm Password"
            onChangeText={setConfrimPass}
            errorMessage={validateConfirmPass(confirmPass)}
          ></Input>
          <Input
            style={styles.input}
            placeholder="Email"
            onChangeText={setEmail}
            onBlur={() => {
              let result = validateEmail(email);
              return result;
            }}
            errorMessage={validateEmail(email)}
          ></Input>
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
  // let { loginData } = route.params;
  // let indicies = [];
  // if (loginData[0].usrRegiment.length != 0) {
  //   indicies = loginData[0].usrRegiment[0];
  // } else {
  //   indicies = [0, 1, 2, 3, 4, 0, 1];
  // }
  let indicies = [0, 1, 2, 3, 4, 0, 1];
  let [saved, setSave] = useState(true);
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
      <View style={styles.container2}>
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
        <Button
          title="Save Regiment"
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
        ></Button>

        <Button
          disabled={saved}
          title="Return to Workout Selection"
          onPress={() => {
            navigation.navigate("Regiment Selection", {
              loginData: loginData,
            });
          }}
        ></Button>
      </View>
    </>
  );
}

function SelectionScreen({ navigation, route }) {
  let { loginData } = route.params;

  let [madeReg, updateMadeReg] = useState(true);
  let [madeGoals, updateMadeGoals] = useState(true);
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

  let usrPushGoals = loginData[0].usrGoals[0];
  let usrPullGoals = loginData[0].usrGoals[1];
  let usrLegGoals = loginData[0].usrGoals[2];
  let usrShoGoals = loginData[0].usrGoals[3];

  let usrPushMaxes = loginData[0].usrMaxes[0];
  let usrPullMaxes = loginData[0].usrMaxes[1];
  let usrLegMaxes = loginData[0].usrMaxes[2];
  let usrShoMaxes = loginData[0].usrMaxes[3];

  let [goal1, setGoal1] = useState();
  let [goal2, setGoal2] = useState();
  let [goal3, setGoal3] = useState();

  let [dispGoals, setDispGoals] = useState([]);
  let [dispMaxes, setDispMaxes] = useState([]);
  let [dispExercise, setDispExercise] = useState([]);
  let [curGroup, setCurGroup] = useState("No Group Selected");
  let [gate, openGate] = useState(true);

  return (
    <>
      <View style={styles.container}>
        <Text>Select a group of Goals to view and edit.</Text>
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
            <Text>Push</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => {
              setCurGroup("Save Pull Workout Goals");
              setDispGoals(usrPullGoals);
              setDispMaxes(usrPullMaxes);
              setDispExercise(["Barbell Rows", "Lat Pull Down", "Cable Rows"]);
              setGoal1(0);
              setGoal2(0);
              setGoal3(0);
              openGate(false);
            }}
          >
            <Text>Pull</Text>
          </Pressable>
        </View>
        <View style={styles.buttonGroup1}>
          <Button
            style={styles.button}
            title="Legs"
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
          ></Button>
          <Button
            style={styles.button}
            title="Shoulders"
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
          ></Button>
        </View>
        <Text style={styles.label}>{dispExercise[0]}</Text>
        <View style={styles.goalsGroup}>
          <Text style={styles.goalsText}>Max - {dispMaxes[0]}</Text>
          <Text style={styles.goalsText}>Goal - {dispGoals[0]}</Text>
        </View>
        <TextInput
          style={styles.goalsInput}
          onChangeText={setGoal1}
        ></TextInput>
        <Text style={styles.label}>{dispExercise[1]}</Text>
        <View style={styles.goalsGroup}>
          <Text style={styles.goalsText}>Max - {dispMaxes[1]}</Text>
          <Text style={styles.goalsText}>Goal - {dispGoals[1]}</Text>
        </View>
        <TextInput
          style={styles.goalsInput}
          onChangeText={setGoal2}
        ></TextInput>
        <Text style={styles.label}>{dispExercise[2]}</Text>
        <View style={styles.goalsGroup}>
          <Text style={styles.goalsText}>Max - {dispMaxes[2]}</Text>
          <Text style={styles.goalsText}>Goal - {dispGoals[2]}</Text>
        </View>
        <TextInput
          style={styles.goalsInput}
          onChangeText={setGoal3}
        ></TextInput>
        <Button
          title={curGroup}
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
        ></Button>
        <Button
          title="Return to Workout Selection"
          onPress={() => {
            navigation.navigate("Regiment Selection", { loginData: loginData });
          }}
        ></Button>
      </View>
    </>
  );
}

function CurrentExerciseScreen({ navigation, route }) {
  let { loginData } = route.params;

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
            <Text>Warmp up your push group with some Push Ups.</Text>
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
              title="Next Exercise"
              onPress={() => {
                setCurPush(inclineBench);
                setReps((reps = 0));
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
      } else if (curPush === inclineBench) {
        return (
          <>
            <Text>Now for some Incline Bench Press.</Text>
            <Text>Reps: {reps}</Text>
            <TextInput
              placeholder="Press here to set your current weight."
              onChangeText={setCurWeight1}
            ></TextInput>
            <Text>Current Goal: {usrPushGoals[0]}</Text>
            <Text>Previous Max: {usrPushMaxes[0]}</Text>
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
              title="Next Exercise"
              onPress={() => {
                setCurPush(flatBench);
                setReps((reps = 0));
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
      } else if (curPush === flatBench) {
        return (
          <>
            <Text>Flat Bench Press.</Text>
            <Text>Reps: {reps}</Text>
            <TextInput
              placeholder="Press here to set your current weight."
              onChangeText={setCurWeight2}
            ></TextInput>
            <Text>Current Goal: {usrPushGoals[1]}</Text>
            <Text>Previous Max: {usrPushMaxes[1]}</Text>
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
              title="Next Exercise"
              onPress={() => {
                setCurPush(chestFly);
                setReps((reps = 0));
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
      } else if (curPush === chestFly) {
        return (
          <>
            <Text>Now for some Chest Flys.</Text>
            <Text>Reps: {reps}</Text>
            <TextInput
              placeholder="Press here to set your current weight."
              onChangeText={setCurWeight3}
            ></TextInput>
            <Text>Current Goal: {usrPushGoals[2]}</Text>
            <Text>Previous Max: {usrPushMaxes[2]}</Text>
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
              title="Complete Workout"
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
                loginData[0].usrMaxes[0].push(newMax3);
                loginData[0].usrMaxes[0].push(newMax2);
                loginData[0].usrMaxes[0].push(newMax1);

                navigation.navigate("Regiment Selection", {
                  loginData: loginData,
                });
              }}
            ></Button>
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
            <Text>Warmp up your pull group with some Pull Ups.</Text>
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
              title="Next Exercise"
              onPress={() => {
                setCurPull(barbellRows);
                setReps((reps = 0));
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
      } else if (curPull === barbellRows) {
        return (
          <>
            <Text>Now for some Barbell Rows.</Text>
            <Text>{reps}</Text>
            <TextInput
              placeholder="Press here to set your current weight."
              onChangeText={setCurWeight1}
            ></TextInput>
            <Text>Current Goal: {usrPullGoals[0]}</Text>
            <Text>Previous Max: {usrPullMaxes[0]}</Text>
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
              title="Next Exercise"
              onPress={() => {
                setCurPull(pullDowns);
                setReps((reps = 0));
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
      } else if (curPull === pullDowns) {
        return (
          <>
            <Text>Lat Pull Downs.</Text>
            <Text>{reps}</Text>
            <TextInput
              placeholder="Press here to set your current weight."
              onChangeText={setCurWeight2}
            ></TextInput>
            <Text>Current Goal: {usrPullGoals[1]}</Text>
            <Text>Previous Max: {usrPullMaxes[1]}</Text>
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
              title="Next Exercise"
              onPress={() => {
                setCurPull(cableRows);
                setReps((reps = 0));
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
      } else if (curPull === cableRows) {
        return (
          <>
            <Text>Now for some Cable Rows.</Text>
            <Text>{reps}</Text>
            <TextInput
              placeholder="Press here to set your current weight."
              onChangeText={setCurWeight3}
            ></TextInput>
            <Text>Current Goal: {usrPullGoals[2]}</Text>
            <Text>Previous Max: {usrPullMaxes[2]}</Text>
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
              title="Complete Workout"
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
                loginData[0].usrMaxes[1].push(newMax1);
                loginData[0].usrMaxes[1].push(newMax2);
                loginData[0].usrMaxes[1].push(newMax3);

                navigation.navigate("Regiment Selection", {
                  loginData: loginData,
                });
              }}
            ></Button>
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
            <Text>Warm up with some Lunges (no weight).</Text>
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
              title="Next Exercise"
              onPress={() => {
                setCurLegs(frontSquats);
                setReps((reps = 0));
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
      } else if (curLegs === frontSquats) {
        return (
          <>
            <Text>Now for some Front Squats.</Text>
            <Text>{reps}</Text>
            <TextInput
              placeholder="Press here to set your current weight."
              onChangeText={setCurWeight1}
            ></TextInput>
            <Text>Current Goal: {usrLegGoals[0]}</Text>
            <Text>Previous Max: {usrLegMaxes[0]}</Text>
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
              title="Next Exercise"
              onPress={() => {
                setCurLegs(backSquats);
                setReps((reps = 0));
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
      } else if (curLegs === backSquats) {
        return (
          <>
            <Text>Now for Back Squats.</Text>
            <Text>{reps}</Text>
            <TextInput
              placeholder="Press here to set your current weight."
              onChangeText={setCurWeight2}
            ></TextInput>
            <Text>Current Goal: {usrLegGoals[1]}</Text>
            <Text>Previous Max: {usrLegMaxes[1]}</Text>
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
              title="Next Exercise"
              onPress={() => {
                setCurLegs(deadlifts);
                setReps((reps = 0));
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
      } else if (curLegs === deadlifts) {
        return (
          <>
            <Text>Finally, some Deadlifts.</Text>
            <Text>{reps}</Text>
            <TextInput
              placeholder="Press here to set your current weight."
              onChangeText={setCurWeight3}
            ></TextInput>
            <Text>Current Goal: {usrLegGoals[2]}</Text>
            <Text>Previous Max: {usrLegMaxes[2]}</Text>
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
              title="Complete Workout"
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
            ></Button>
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
            <Text>Warmp up with some Tea Cups.</Text>
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
              title="Next Exercise"
              onPress={() => {
                setCurShoul(sideRaise);
                setReps((reps = 0));
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
      } else if (curShoul === sideRaise) {
        return (
          <>
            <Text>Now for some Side Raises.</Text>
            <Text>{reps}</Text>
            <TextInput
              placeholder="Press here to set your current weight."
              onChangeText={setCurWeight1}
            ></TextInput>
            <Text>Current Goal: {usrShoGoals[0]}</Text>
            <Text>Previous Max: {usrShoMaxes[0]}</Text>
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
              title="Next Exercise"
              onPress={() => {
                setCurShoul(ohPress);
                setReps((reps = 0));
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
      } else if (curShoul === ohPress) {
        return (
          <>
            <Text>Overhead Press.</Text>
            <Text>{reps}</Text>
            <TextInput
              placeholder="Press here to set your current weight."
              onChangeText={setCurWeight2}
            ></TextInput>
            <Text>Current Goal: {usrShoGoals[1]}</Text>
            <Text>Previous Max: {usrShoMaxes[1]}</Text>
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
              title="Next Exercise"
              onPress={() => {
                setCurShoul(facePulls);
                setReps((reps = 0));
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
      } else if (curShoul === facePulls) {
        return (
          <>
            <Text>Now for some Face Pulls.</Text>
            <Text>{reps}</Text>
            <TextInput
              placeholder="Press here to set your current weight."
              onChangeText={setCurWeight3}
            ></TextInput>
            <Text>Current Goal: {usrShoGoals[2]}</Text>
            <Text>Previous Max: {usrShoMaxes[2]}</Text>
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
              title="Complete Workout"
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
            ></Button>
          </>
        );
      }
    case 4:
      return (
        <>
          <Text>Looks like today is your Rest Day!</Text>
          <Text>
            Keep your muscles in good condition with the following stretches.
          </Text>
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
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    paddingBottom: 10,
    marginHorizontal: 5,
  },
  label: {
    fontSize: width * 0.06,
    paddingLeft: width * 0.1,
  },
  text: { width: width, fontSize: width * 0.1, textAlign: "center" },

  slider: {
    borderTopWidth: 3,
    borderBottomWidth: 3,
  },

  button: {
    width: width * 0.45,
    margin: 5,
  },

  buttonGroup1: {
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonGroup2: {
    paddingVertical: width * 0.2,
    width: width * 0.7,
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
  returnButtonFont: {
    fontSize: 40,
    color: "white",
    textAlign: "center",
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
    marginVertical: 10,
    justifyContent: "center",
  },
  goalsText: {
    fontSize: width * 0.1,
    paddingHorizontal: 20,
    paddingVertical: 3,
  },
  goalsInput: {
    alignSelf: "center",
    borderWidth: 1,
    width: width * 0.5,
    height: width * 0.1,
    marginBottom: 15,
  },

  input: {
    width: width * 0.85,
    height: width * 0.17,
    fontSize: 30,
    paddingHorizontal: 20,
    color: "black",
  },
  inputGroup: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 15,
    backgroundColor: "white",
    padding: 10,
    margin: 10,
  },
});
