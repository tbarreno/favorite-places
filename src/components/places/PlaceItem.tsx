import { ReactNode } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { Place } from "../../models/Place";
import { Colors } from "../../constants/colors";

type Props = {
    place: Place;
    onPress: (placeId: string) => void;
};

const PlaceItem = ({ place, onPress }: Props): ReactNode => {
    const pressHandler = () => {
        onPress(place.id);
    };

    return (
        <Pressable
            style={({ pressed }) => [styles.item, pressed && styles.pressed]}
            onPress={pressHandler}
        >
            <View style={styles.placeCard}>
                <Image style={styles.image} source={{ uri: place.imageUri }} />
                <View style={styles.info}>
                    <Text style={styles.title}>{place.title}</Text>
                    <Text style={styles.address}>{place.address}</Text>
                </View>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    placeCard: {
        flexDirection: "column",
    },
    item: {
        flexDirection: "row",
        alignItems: "flex-start",
        borderRadius: 6,
        marginVertical: 8,
        backgroundColor: Colors.primary500,
        elevation: 2,
        shadowColor: "black",
        shadowOpacity: 0.15,
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 2,
        overflow: "hidden",
    },
    pressed: {
        opacity: 0.9,
    },
    image: {
        flex: 1,
        borderBottomLeftRadius: 4,
        borderTopLeftRadius: 4,
        // height: 100,
        aspectRatio: 1.77,
    },
    info: {
        flex: 1,
        padding: 8,
    },
    title: {
        fontWeight: "bold",
        fontSize: 18,
        color: Colors.gray900,
        marginBottom: 4,
    },
    address: {
        fontSize: 14,
        color: Colors.gray900,
    },
});

export default PlaceItem;
