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
import mmkvStorage from "@/utils/mmkvStorage";
import TaskFrequencyDropdownMenu from "./zeego/TaskFrequencyDropdownMenu";
import WeekdayFrequencyPicker from "./WeekdayFrequencyPicker";

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
    key: "habitName",
    label: "Habit Name",
    placeholder: "Read 10 minutes a day",
    required: true,
  },
  {
    key: "habitDescription",
    label: "Habit Description",
    placeholder: "optional",
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

  const [activeHabitItemIndex, setActiveHabitItemIndex] = useState(0);

  const [habitsFrequency, setHabitFrequency] = useState(
    // this array contains array of days (In the format of Mon, Tue, Wed) that the user wants to do these habits on
    Array(1).fill(null)
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [moreHabitsArray, setMoreHabitsArray] = useState(Array(1).fill(null));

  console.log("baburao ka style", moreHabitsArray);

  const handleNewHabitSubmission = function () {
    console.log(moreHabitsArray, "WOOOO YEAH WOOHOHHOOH YEAH WOHOHOH YWAH");
    setModalVisible(false);
    const habitData = values;
    habitData.iconName = getHabitIcon(habitData.habitName);

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

    // modifying the moreHabitsArray to have a points as well based on the number of days the habit is being done
    const newMoreHabitsArray = [...moreHabitsArray]; // not using setMoreHabitsArray to avoid re-render loop because of moreHabitsArray dependency on this useEffect
    newMoreHabitsArray.forEach((item, index) => {
      if (item && item.frequency) {
        // if the frequency property exists within that habit item:
        // seeing how many days the user is doing that particular habit:
        const daysHabitIsActive = item.frequency.reduce(
          (count: number, value: boolean) => {
            return value ? count + 1 : count;
          },
          0
        );

        // and then add points as a property to the habit items of the moreHabitsArray:
        // points are calculated in the following manner:
        // daily habits give 20 points each (daysHabitIsActive == 7)
        // 5-6 habit days give 15 points
        // 1-4 habit days give 10 points

        const habitPoints = [0, 10, 10, 10, 10, 15, 15, 20];
        // adding a  0 in the start to make this array 1 indexable, and also work with 0 frequency days
        // the 0 frequency days is implemented to prevent any crashes

        item.points = habitPoints[daysHabitIsActive];
      }
    });

    // as well as store everything that is in the morHabitsArray in the mmkv storage

    mmkvStorage.set(
      "moreHabits",
      JSON.stringify(newMoreHabitsArray.slice(0, -1))
    ); // saving all the habit items except the last one
    // because it's always gonna be null
  }, [moreHabitsArray]);

  const renderEmptyBoxes = () => {
    return moreHabitsArray.map((_, index) => (
      <Pressable
        key={index}
        style={styles.row}
        onPress={() => {
          setModalVisible(true);
          setActiveHabitItemIndex(index);
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
              ? moreHabitsArray[index].habitName
              : "Add a Habit"}
          </Text>
          <Text style={styles.subtitlePlaceholder}>
            {moreHabitsArray[index]
              ? moreHabitsArray[index].habitDescription
              : null}
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
                  <TaskFrequencyDropdownMenu
                    index={activeHabitItemIndex}
                    onSetHabitFrequency={setHabitFrequency}
                  />

                  <View style={styles.spaceSmall} />
                  <WeekdayFrequencyPicker
                    currentFrequency={
                      habitsFrequency[activeHabitItemIndex] || []
                    }
                    changeValues={setValues}
                  />

                  <Text style={styles.formLabel}></Text>
                  {/* <WeekdayFrequencyPicker /> */}
                  <View style={styles.space} />
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
    space: {
      marginVertical: theme.spacing.m,
    },
    spaceSmall: {
      marginVertical: theme.spacing.s,
    },
    formLabel: {
      ...theme.text.body,
      color: theme.colors.text,
      marginBottom: theme.spacing.s,
    },
  });
}
