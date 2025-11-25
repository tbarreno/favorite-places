import { ReactNode } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import OutlinedButton from "./OutlinedButton";
import { Colors } from "../constants/colors";
import {
  LocationAccuracy,
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from "expo-location";
import { getMapPreview } from "../util/location";
import { useNavigation } from "@react-navigation/native";
import { Location } from "../types/Location";

type Props = Location & {
  locationAddress: string;
  onSetLocation: (location: Location) => void;
};

const LocationPicker = ({ lat, lon, locationAddress, onSetLocation }: Props): ReactNode => {
  const navigation = useNavigation();
  const [locationPermissionInfo, requestPermission] =
    useForegroundPermissions();

  const verifyPermissions = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (locationPermissionInfo?.status === PermissionStatus.UNDETERMINED) {
        requestPermission().then((permissionResponse) => {
          resolve(permissionResponse.granted);
        });
      }

      if (locationPermissionInfo?.status === PermissionStatus.DENIED) {
        Alert.alert(
          "GPS access denied",
          "This app requires access to GPS to get the current position"
        );
        resolve(false);
      }

      resolve(true);
    });
  };

  const getLocationHandler = (): Promise<boolean> => {
    return new Promise((resolve) => {
      verifyPermissions().then((hasPermission) => {
        if (hasPermission) {
          getCurrentPositionAsync({
            accuracy: LocationAccuracy.Balanced,
            timeInterval: 1000,
          })
            .then((location) => {
              console.log(location);
              onSetLocation({
                lat: location.coords.latitude,
                lon: location.coords.longitude,
              });
              resolve(true);
            })
            .catch((error) => {
              console.log("Error getting the position: ", error);
            });
        }
      });
      resolve(false);
    });
  };

  const pickOnMapHandler = () => {
    navigation.navigate("Map", { lat, lon, readonly: false });
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapPreview}>
        <Image
          style={styles.mapImage}
          source={{
            uri: getMapPreview({ lat, lon }),
            height: 200,
            width: 400,
          }}
        />
      </View>
      <View style={styles.addressContainer}>
          <Text style={styles.addressText}>{locationAddress}</Text>
      </View>
      <View style={styles.actions}>
        <OutlinedButton icon="location" onPress={getLocationHandler}>
          Current location
        </OutlinedButton>
        <OutlinedButton icon="map" onPress={pickOnMapHandler}>
          Select on map
        </OutlinedButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
  mapPreview: {
    height: 180,
    textAlignVertical: "center",
    textAlign: "center",
    color: "#fff",
    backgroundColor: Colors.primary800,
    marginVertical: 6,
    borderRadius: 4,
  },
  mapImage: {
    height: "100%",
    width: "100%",
    borderRadius: 4,
  },
  addressContainer: {
    width: "100%",
    padding: 8,
  },
  addressText: {
    color: Colors.accent500,
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default LocationPicker;
