import "react-native-gesture-handler";
import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as PaperProvider, MD3LightTheme } from "react-native-paper";

export const UserContext = React.createContext();
export const LoggedInContext = React.createContext(false);

const Stack = createStackNavigator();
import signIn from "./signIn.js";
import home from "./home.js";
import profile from "./profile.js";
import userRegistration from "./userRegistration.js";

const theme = {
  ...MD3LightTheme, // or MD3DarkTheme
  roundness: 2,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#3498db",
    secondary: "#f1c40f",
    tertiary: "#a1b2c3",
  },
};

const App = () => {
  const [user, setUser] = React.useState();
  const [loggedIn, setLoggedIn] = React.useState();
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <LoggedInContext.Provider value={{loggedIn, setLoggedIn}}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={home} />
            <Stack.Screen name="SignIn" component={signIn} />
            <Stack.Screen
              name="userRegistration"
              component={userRegistration}
            />
            <Stack.Screen name="Profile" component={profile} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
      </LoggedInContext.Provider>
    </UserContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "90%",
    height: "90%",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
  },
  navButton: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    top: "20%",
    left: "75%",
    alignSelf: "flex-end",
    paddingHorizontal: 0,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
    width: "88%",
    height: "88%",
  },
});

export default App;
