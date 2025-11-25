import { ReactNode } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import PlaceItem from "./PlaceItem";
import { Place } from "../../models/Place";
import { Colors } from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";

type Props = {
    places: Place[];
};

const PlacesList = ({ places }: Props): ReactNode => {
    const navigation = useNavigation();

    const clickHandler = (placeId: string) => {
        navigation.navigate("PlaceDetails", {
            placeId,
        });
    };

    if (!places || places.length === 0) {
        return (
            <View style={styles.fallbackContainer}>
                <Text style={styles.fallbackText}>Add the first favorite place</Text>
            </View>
        );
    }

    return (
        <View style={styles.flatListContainer}>
            <FlatList
                data={places}
                renderItem={(data) => (
                    <PlaceItem place={data.item} onPress={clickHandler} />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    fallbackContainer: {
        flex: 1,
        justifyContent: "center",
        margin: 12,
    },
    fallbackText: {
        textAlign: "center",
        fontSize: 16,
        color: Colors.primary200,
    },
    flatListContainer: {
        flex: 1,
        margin: 12,
    },
});

export default PlacesList;
