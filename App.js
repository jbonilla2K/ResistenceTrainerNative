import { useState, useEffect, useCallback, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import { CheckBox, Input, Button } from "@rneui/themed";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput, TouchableOpacity } from "react-native-web";
import { SwiperFlatList } from "react-native-swiper-flatlist";

import LoginScreen from "./screens/LoginScreen";

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
          initialParams={{ loginData: loginData }}
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
    usrGoals: [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [9, 10, 11],
    ],
    usrMaxes: [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [9, 10, 11],
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

  let [saved, setSave] = useState(true);
  const scrollRef1 = React.useRef(null);
  const scrollRef2 = React.useRef(null);
  const scrollRef3 = React.useRef(null);
  const scrollRef4 = React.useRef(null);
  const scrollRef5 = React.useRef(null);
  const scrollRef6 = React.useRef(null);
  const scrollRef7 = React.useRef(null);

  let newRegiment = [];

  function clearArray(array) {
    for (let i = 0; i <= array.length + 1; i++) {
      array.pop();
    }
  }

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
      <View style={styles.container}>
        <Text>Sunday</Text>
        <SwiperFlatList
          ref={scrollRef1}
          index={0}
          data={regDays}
          renderItem={({ item }) => (
            <View style={[styles.child]}>
              <Text style={styles.text}>{item}</Text>
            </View>
          )}
        />

        <Text>Monday</Text>
        <SwiperFlatList
          ref={scrollRef2}
          index={1}
          data={regDays}
          renderItem={({ item }) => (
            <View style={[styles.child]}>
              <Text style={styles.text}>{item}</Text>
            </View>
          )}
        />
        <Text>Tuesday</Text>
        <SwiperFlatList
          ref={scrollRef3}
          index={2}
          data={regDays}
          renderItem={({ item }) => (
            <View style={[styles.child]}>
              <Text style={styles.text}>{item}</Text>
            </View>
          )}
        />
        <Text>Wednesday</Text>
        <SwiperFlatList
          ref={scrollRef4}
          index={3}
          data={regDays}
          renderItem={({ item }) => (
            <View style={[styles.child]}>
              <Text style={styles.text}>{item}</Text>
            </View>
          )}
        />
        <Text>Thursday</Text>
        <SwiperFlatList
          ref={scrollRef5}
          index={4}
          data={regDays}
          renderItem={({ item }) => (
            <View style={[styles.child]}>
              <Text style={styles.text}>{item}</Text>
            </View>
          )}
        />
        <Text>Friday</Text>
        <SwiperFlatList
          ref={scrollRef6}
          index={0}
          data={regDays}
          renderItem={({ item }) => (
            <View style={[styles.child]}>
              <Text style={styles.text}>{item}</Text>
            </View>
          )}
        />
        <Text>Saturday</Text>
        <SwiperFlatList
          ref={scrollRef7}
          index={1}
          data={regDays}
          renderItem={({ item }) => (
            <View style={[styles.child]}>
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
  console.log(loginData);
  let [madeReg, updateMadeReg] = useState(true);
  useEffect(() => {
    if (loginData[0].usrRegiment.length != 0) {
      updateMadeReg(false);
    } else {
      console.log("current user has made no regiment");
    }
  });

  return (
    <>
      <Text>This is the Workout Selection Screen</Text>
      <Button
        title={madeReg ? "Create Regiment" : "Edit Regiment"}
        onPress={() => {
          navigation.navigate("Regiment Editor", { loginData: loginData });
        }}
      ></Button>
      <Button
        title="Begin Custom Workout"
        disabled={madeReg}
        onPress={() => {
          if (!madeReg) {
            navigation.navigate("Workout", { loginData: loginData });
          } else {
            alert("You must make a custom regiment first!");
          }
        }}
      ></Button>
      <Button
        title="View Goals"
        onPress={() => {
          navigation.navigate("Goals", { loginData: loginData });
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

  function clearArray(array) {
    for (let i = 0; i <= array.length + 1; i++) {
      array.pop();
    }
  }

  return (
    <>
      <Text>Select a group of Goals to view and edit.</Text>
      <Button
        title="View Push Day Exercises"
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
      ></Button>
      <Button
        title="View Pull Day Exercises"
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
      ></Button>
      <Button
        title="View Leg Day Exercises"
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
        title="View Shoulder Day Exercises"
        onPress={() => {
          setCurGroup("Save Shoulders Workout Goals");
          setDispGoals(usrShoGoals);
          setDispMaxes(usrShoMaxes);
          setDispExercise(["Lateral Raise", "Overhead Press", "Face Pulls"]);
          setGoal1(0);
          setGoal2(0);
          setGoal3(0);
          openGate(false);
        }}
      ></Button>
      <Text>{dispExercise[0]}</Text>
      <Text>{dispMaxes[0]}</Text>
      <TextInput placeholder={dispGoals[0]} onChangeText={setGoal1}></TextInput>
      <Text>{dispExercise[1]}</Text>
      <Text>{dispMaxes[1]}</Text>
      <TextInput placeholder={dispGoals[1]} onChangeText={setGoal2}></TextInput>
      <Text>{dispExercise[2]}</Text>
      <Text>{dispMaxes[2]}</Text>
      <TextInput placeholder={dispGoals[2]} onChangeText={setGoal3}></TextInput>
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
    </>
  );
}

function CurrentExerciseScreen({ navigation, route }) {
  let { loginData } = route.params;

  let [reps, setReps] = useState(0);

  let usrReg = loginData[0].usrRegiment;
  const d = new Date();
  let day = d.getDay();
  let regIndex = usrReg[0][day];

  let [curGoals, setCurGoals] = useState([]);

  switch (regIndex) {
    case 0:
      const pushUps = 0;
      const inclineBench = 1;
      const flatBench = 2;
      const chestFly = 3;
      let [curPush, setCurPush] = useState(pushUps);
      console.log(loginData[0].usrGoals[0]);

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
              title="Complete Workout"
              onPress={() => {
                setReps((reps = 0));
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
            <Text>Warmp up your push group with some Pull Ups.</Text>
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
  container: { backgroundColor: "white" },
  text: { width: width, fontSize: width * 0.1, textAlign: "center" },
});
