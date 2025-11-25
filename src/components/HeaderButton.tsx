import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { PressHandler } from "../types/PressHandler";

type Props = {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size: number;
  onPress: PressHandler;
};

const HeaderButton = ({ name, color, size, onPress }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={name} color={color} size={size} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    borderRadius: 24,
    padding: 6,
    margin: 8,
  },
  pressed: {
    opacity: 0.75,
  },
});

export default HeaderButton;
