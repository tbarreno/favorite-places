import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import MainNavigator from "./src/navigation/MainNavigator";
import { MainStackParamList } from "./src/types/NavigationTypes";
import { PlaceContextProvider } from "./src/store/place-store";
import { useEffect, useState } from "react";
import { init } from "./src/util/database";

declare global {
    namespace ReactNavigation {
        interface RootParamList extends MainStackParamList {}
    }
}

export default function App() {
    const [isDbReady, setIsDbReady] = useState(false);

    useEffect(() => {
        // Database initialization
        // TO-DO: Error management (show the error message in the screen)
        init()
            .then(() => {
                setIsDbReady(true);
            })
            .catch((error) => {
                console.log("Error: ", error);
            });
    }, [init, setIsDbReady]);

    if (!isDbReady) {
        return (
            <View style={styles.container}>
                <Text>Loading places...</Text>
            </View>
        );
    }

    return (
        <PlaceContextProvider>
            <NavigationContainer>
                <StatusBar style="auto" />
                <MainNavigator />
            </NavigationContainer>
        </PlaceContextProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
