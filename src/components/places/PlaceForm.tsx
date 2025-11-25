import { ReactNode, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { MainStackParamList } from "../../types/NavigationTypes";

import { Colors } from "../../constants/colors";
import ImagePicker from "../ImagePicker";
import LocationPicker from "../LocationPicker";
import { Location } from "../../types/Location";
import ActionButton from "../ActionButton";
import { ImageInfo } from "../../types/ImageInfo";
import { getReverseGeocode } from "../../util/location";
import { Place } from "../../models/Place";

type ImageData = ImageInfo | null;

type Props = {
    onAddPlace: (place: Place) => void;
};

const PlaceForm = ({ onAddPlace }: Props): ReactNode => {
    const [title, setTitle] = useState("");
    const [pickedImageInfo, setPickedImageInfo] = useState<ImageData>(null);
    const [pickedLocation, setPickedLocation] = useState<Location>({
        lat: 40.62,
        lon: -4.006,
    });
    const [locationAddress, setLocationAddress] = useState<string>("");

    const route = useRoute<RouteProp<MainStackParamList, "AddPlace">>();

    useEffect(() => {
        const initialLat = route.params ? route.params.lat : 40.62;
        const initialLon = route.params ? route.params.lon : -4.006;

        setPickedLocation({ lat: initialLat, lon: initialLon });
    }, [route, setPickedLocation]);

    useEffect(() => {
        const getAddress = setTimeout(() => {
            getReverseGeocode(pickedLocation)
                .then((address) => {
                    setLocationAddress(address);
                })
                .catch((error) => {
                    console.log("Error getting location address: ", error);
                    setLocationAddress("");
                });
        }, 1000);

        return () => clearTimeout(getAddress);
    }, [pickedLocation]);

    const changeTitleHandler = (enteredText: string): void => {
        setTitle(enteredText);
    };

    const pickLocationHandler = (coordinates: Location): void => {
        setPickedLocation(coordinates);
    };

    const pickImageHandler = (image: ImageData) => {
        setPickedImageInfo(image);
    };

    const saveHandler = () => {
        const newPlace: Place = {
            id: "",
            title,
            address: locationAddress,
            imageUri: pickedImageInfo?.uri,
            latitude: pickedLocation.lat,
            longitude: pickedLocation.lon,
        };

        onAddPlace(newPlace);
    };

    return (
        <ScrollView style={styles.container}>
            <View>
                <Text style={styles.formLabel}>Place name</Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={changeTitleHandler}
                />
                <ImagePicker
                    image={pickedImageInfo}
                    onImageSelected={pickImageHandler}
                />
                <LocationPicker
                    lat={pickedLocation.lat}
                    lon={pickedLocation.lon}
                    locationAddress={locationAddress}
                    onSetLocation={pickLocationHandler}
                />
                <View style={styles.saveContainer}>
                    <ActionButton icon="save" onPress={saveHandler}>
                        Save
                    </ActionButton>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    formLabel: {
        fontWeight: "bold",
        marginBottom: 4,
        color: Colors.primary50,
    },
    textInput: {
        marginVertical: 8,
        paddingHorizontal: 4,
        paddingVertical: 8,
        fontSize: 16,
        borderBottomColor: Colors.primary800,
        borderBottomWidth: 2,
        backgroundColor: Colors.primary50,
    },
    saveContainer: {
        marginTop: 8,
        // paddingHorizontal: 4,
    },
});

export default PlaceForm;
