import { ReactNode, useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MainStackParamList } from "../types/NavigationTypes";
import { Place } from "../models/Place";
import { deletePlace, fetchPlaceDetails } from "../util/database";
import ActionButton from "../components/ActionButton";
import OutlinedButton from "../components/OutlinedButton";

type Props = NativeStackScreenProps<MainStackParamList, "PlaceDetails">;

type PossiblePlace = Place | null;

const PlaceDetails = ({ route, navigation }: Props): ReactNode => {
    const [currentPlace, setCurrentPlace] = useState<PossiblePlace>(null);
    const selectedPlaceId = route.params.placeId;

    useEffect(() => {
        fetchPlaceDetails(selectedPlaceId)
            .then((place) => {
                setCurrentPlace(place);
                navigation.setOptions({
                    title: place.title,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }, [selectedPlaceId]);

    const mapButtonHandler = () => {
        if (currentPlace?.latitude && currentPlace.longitude) {
            navigation.navigate("Map", {
                lat: currentPlace.latitude,
                lon: currentPlace.longitude,
                readonly: true,
            });
        }
    };

    const deleteHandler = () => {
        if (currentPlace) {
            deletePlace(currentPlace.id).then(() => {
                navigation.navigate("List");
            });
        }
    }

    if (currentPlace === null) {
        return (
            <View style={styles.locationContainer}>
                <View style={styles.addressContainer}>
                    <Text style={styles.address}>
                        Loading place data...
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <ScrollView>
            <Image
                style={styles.image}
                source={{ uri: currentPlace?.imageUri }}
            />
            <View style={styles.locationContainer}>
                <View style={styles.addressContainer}>
                    <Text style={styles.address}>{currentPlace?.address}</Text>
                </View>
            </View>
            <View style={styles.buttonsContainer}>       
                <OutlinedButton icon="trash" onPress={deleteHandler}>
                    Delete
                </OutlinedButton>
                <ActionButton icon="map" onPress={mapButtonHandler}>
                    See on Map
                </ActionButton>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    image: {
        height: "35%",
        minHeight: 300,
        width: "100%",
    },
    locationContainer: {
        justifyContent: "center",
        alignItems: "center",
        padding: 4,
        borderRadius: 8,
    },
    addressContainer: {
        padding: 20,
    },
    address: {
        color: Colors.primary500,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16,
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 4,
        borderRadius: 8,
    },
});

export default PlaceDetails;
