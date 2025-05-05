import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeContext";
import { useEffect, useState } from "react";
import { getHabitIcon } from "@/utils/misc/habitIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Components:
import GenericForm from "../general/GenericForm";
import CTAButton from "../general/CTAButton";

type ItemPickerProps = {
  onItemPress?: (index: number) => void;
  onModalSubmit?: any;
  items?: Array<{
    title?: string;
    subtitle?: string;
    selected?: boolean;
  }>;
};

const fields = [
  {
    key: "habit",
    label: "Habit Name",
    placeholder: "Read 10 minutes a day",
    required: true,
  },
  {
    key: "description",
    label: "Habit Description",
    placeholder: "optional",
    required: false,
  },
  {
    key: "frequency",
    label: "Habit Frequency",
    placeholder: "every monday, wednesday, friday",
    required: false,
  },
];

const { width } = Dimensions.get("window");
const BOX_SIZE = Math.min(width * 0.18, 80); // Responsive but capped at 80px in length and width

export default function VariableItemPicker({
  onItemPress,
  onModalSubmit,
}: ItemPickerProps) {
  const theme = useTheme();
  const styles = createStyles(theme, BOX_SIZE);
  const [values, setValues] = useState<any>({}); // values for the form inside the modal

  const [modalVisible, setModalVisible] = useState(false);
  const [moreHabitsArray, setMoreHabitsArray] = useState(Array(1).fill(null));

  const handleNewHabitSubmission = function () {
    console.log(moreHabitsArray, "WOOOO YEAH WOOHOHHOOH YEAH WOHOHOH YWAH");
    setModalVisible(false);
    const habitData = values;
    habitData.iconName = getHabitIcon(habitData.habit);

    setValues({}); // clear the form upon submission

    setMoreHabitsArray((oldMoreHabitsArray: any) => {
      // all this yapping basically does is replaces the last element
      // (which is a null to generate a blank habit adder) with the typed habit,
      // and add another null to keep the cycle going
      const newMoreHabitsArray = [...oldMoreHabitsArray];
      newMoreHabitsArray[newMoreHabitsArray.length - 1] = habitData;

      return [...newMoreHabitsArray, null];
    });
  };

  useEffect(() => {
    // small delay to include scrolling to the bottom when a new box is added
    setTimeout(() => {
      onModalSubmit();
    }, 100);

    // as well as store everything that is in the morHabitsArray in the asyncstorage
    AsyncStorage.setItem("moreHabits", JSON.stringify(moreHabitsArray));
  }, [moreHabitsArray]);

  const renderEmptyBoxes = () => {
    return moreHabitsArray.map((_, index) => (
      <Pressable
        key={index}
        style={styles.row}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <View style={styles.box}>
          <Ionicons
            name={
              moreHabitsArray[index] ? moreHabitsArray[index].iconName : "add"
            }
            size={BOX_SIZE * 0.5}
            color={theme.colors.textSecondary}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.placeholder}>
            {moreHabitsArray[index]
              ? moreHabitsArray[index].habit
              : "Add a Habit"}
          </Text>
          <Text style={styles.subtitlePlaceholder}>
            {moreHabitsArray[index] ? moreHabitsArray[index].description : null}
          </Text>
        </View>
      </Pressable>
    ));
  };

  return (
    <View style={styles.container}>
      {renderEmptyBoxes()}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setValues({});
        }}
      >
        <View style={styles.modalContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={0}
          >
            <Pressable
              style={styles.modalOverlay}
              onPress={() => {
                setModalVisible(false);
                setValues({});
              }}
            >
              <Pressable
                style={styles.modalContent}
                onPress={(e) => e.stopPropagation()}
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Add Habit</Text>
                  <Pressable
                    style={styles.crossButton}
                    onPress={() => {
                      setModalVisible(false);
                      setValues({});
                    }}
                  >
                    <Ionicons
                      name="close"
                      size={24}
                      color={theme.colors.textSecondary}
                    />
                  </Pressable>
                </View>
                <ScrollView keyboardShouldPersistTaps="handled">
                  <GenericForm
                    fields={fields}
                    onValueChange={(key, value) => {
                      setValues((prev: any) => ({ ...prev, [key]: value }));
                      console.log(values);
                    }}
                    values={values}
                  />
                  <CTAButton
                    title={"Submit"}
                    onPress={() => {
                      handleNewHabitSubmission();
                    }}
                    iconName="checkmark-circle-outline"
                  />
                </ScrollView>
              </Pressable>
            </Pressable>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

function createStyles(theme: any, boxSize: number) {
  return StyleSheet.create({
    container: {
      width: "100%",
      paddingHorizontal: theme.spacing.m,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: theme.colors.background, // Same as modal background
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.m,
    },
    box: {
      width: boxSize,
      height: boxSize,
      borderRadius: theme.radius.m,
      backgroundColor: theme.colors.surface,
      justifyContent: "center",
      alignItems: "center",
      marginRight: theme.spacing.m,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    textContainer: {
      flex: 1,
    },
    placeholder: {
      ...theme.text.h2,
      color: theme.colors.textSecondary,
    },
    subtitlePlaceholder: {
      ...theme.text.body,
      color: theme.colors.textSecondary,
      opacity: 0.7,
    },
    // modal styles:
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: theme.colors.altBackground, // this is the bg color of the modal window
      padding: theme.spacing.l,
      borderTopLeftRadius: theme.radius.l,
      borderTopRightRadius: theme.radius.l,
      minHeight: "90%",
    },
    modalTitle: {
      ...theme.text.h2,
      color: theme.colors.text,
      marginBottom: theme.spacing.m,
    },
    crossButton: {
      padding: theme.spacing.s,
      marginRight: -theme.spacing.s, // Offset padding to align with content
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.l,
    },
  });
}
