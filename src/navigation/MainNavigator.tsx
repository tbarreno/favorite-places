import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ReactNode } from "react";
import AllPlaces from "../screens/AllPlaces";
import AddPlace from "../screens/AddPlace";
import HeaderButton from "../components/HeaderButton";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Colors } from "../constants/colors";
import Map from "../screens/Map";
import { MainStackParamList } from "../types/NavigationTypes";
import PlaceDetails from "../screens/PlaceDetails";

export type StackNavigation = NavigationProp<MainStackParamList>;

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainNavigator = (): ReactNode => {
    const navigation = useNavigation<StackNavigation>();

    return (
        <Stack.Navigator
            initialRouteName="List"
            screenOptions={{
                headerStyle: {
                    backgroundColor: Colors.primary500,
                },
                headerTintColor: Colors.gray900,
                contentStyle: {
                    backgroundColor: Colors.gray700,
                },
            }}
        >
            <Stack.Screen
                options={{
                    title: "Favorite Places",
                    headerRight: ({ tintColor }) => (
                        <HeaderButton
                            name="add-circle"
                            size={24}
                            color={tintColor || "black"}
                            onPress={() => {
                                navigation.navigate("AddPlace");
                            }}
                        />
                    ),
                }}
                name="List"
                component={AllPlaces}
            />
            <Stack.Screen
                options={{ title: "Add new place" }}
                name="AddPlace"
                component={AddPlace}
            />
            <Stack.Screen
                name="Map"
                options={{ title: "Map" }}
                component={Map}
            />
            <Stack.Screen
                name="PlaceDetails"
                component={PlaceDetails}
                options={{
                    title: "Loading...",
                }}
            />
        </Stack.Navigator>
    );
};

export default MainNavigator;
