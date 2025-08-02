import { useEffect } from "react";
import HomeScreen from "./src/Screens/Home";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {

  return (
    <SafeAreaProvider>
        <HomeScreen/>
    </SafeAreaProvider>
  )
}