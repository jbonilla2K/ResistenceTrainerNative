import { useState, useEffect, useCallback, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, FlatList, StyleSheet, Text, View } from "react-native";
import { CheckBox, Input, Button } from "@rneui/themed";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function App() {
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
  return (
    <>
      <Text>This is the Login Screen</Text>
      <Button
        title="Select Regiment"
        onPress={() => {
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
