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
import mmkvStorage from "@/utils/mmkvStorage";
import { getHabitIcon } from "@/utils/misc/habitIcons";
import { generateHabitId } from "@/utils/randomId";
// Components:
import GenericForm from "../general/GenericForm";
import CTAButton from "../general/CTAButton";
import WeekdayFrequencyPicker from "./WeekdayFrequencyPicker";
import FrequencyPickerOptionList from "./FrequencyPickerOptionList";
import TaskFrequencyDropdownMenu from "./zeego/TaskFrequencyDropdownMenu";
import { FormValuesType, HabitObject } from "@/utils/types";

type ItemPickerProps = {
  numRows: number;
  onItemPress?: (index: number) => void;
  onAllHabitSelected: any;
  habitItems?: Array<{
    title?: string;
    subtitle?: string;
    selected?: boolean;
  }>;
};

const fields = [
  {
    key: "habitName",
    label: "Habit Name",
    placeholder: "Example Habit",
    required: true,
  },
  {
    key: "habitDescription",
    label: "Habit Description",
    placeholder: "Example Description",
    required: false,
  },
];

//  {
//     habitName: "Exercise",
//     habitDeadline: "6:00 PM",
//     habitFrequency: 1,
//     completedFrequency: 1,
//     points: 150,
//   },

const { width } = Dimensions.get("window");
const BOX_SIZE = Math.min(width * 0.18, 80); // Responsive but capped at 80px in length and width

export default function FixedItemPicker({
  numRows,
  onItemPress,
  onAllHabitSelected,
}: ItemPickerProps) {
  const theme = useTheme();
  const styles = createStyles(theme, BOX_SIZE);
  const [values, setValues] = useState<any>({}); // values for the form inside the modal
  const [activeHabitItemIndex, setActiveHabitItemIndex] = useState(0);
  const [habitsFrequency, setHabitFrequency] = useState(
    // this array contains array of days (In the format of Mon, Tue, Wed) that the user wants to do these habits on
    Array(numRows).fill(null)
  );

  const [habitItems, setHabitItems] = useState<HabitObject[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleNewHabitSubmission = function () {
    setModalVisible(false);
    const habitData = values;
    habitData.iconName = getHabitIcon(habitData.habitName); // generate icons from a predetermined list
    setValues({}); // clearing form data upon submission

    // if (habitItems.length <= 3) {
    setHabitItems((oldHabitItems: HabitObject[]) => {
      const newHabitItems = [...oldHabitItems];
      newHabitItems[activeHabitItemIndex] = habitData;
      // newHabitItems[activeHabitItemIndex].iconName = response.data.success
      //   ? response.data.response
      //   : "checkmark-outline";

      return newHabitItems;
    });

    // }
  };

  useEffect(() => {
    // Implementation for Unique ID, Points Awarding when all 3 habits are filled
    if (habitItems.length == numRows) {
      // when all the habit items are filled, trigger the callback onAllHabitSelected passed from prop
      onAllHabitSelected();

      // modifying the habitItems array to have UNIQUE ID + points as well based on the number of days the habit is being done
      const newHabitItems = [...habitItems];
      newHabitItems.forEach((item, index) => {
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

          // as well as assign the unique ID:
          item.id = generateHabitId();
        }
      });

      // as well as save an updated version of the habitItems (with points) to the mmkv storage
      mmkvStorage.set("coreHabits", JSON.stringify(newHabitItems));
      mmkvStorage.set("activeHabits", JSON.stringify(newHabitItems));
    }
  }, [habitItems]);

  const renderEmptyBoxes = () => {
    return Array(numRows)
      .fill(null)
      .map((_, index) => (
        <Pressable
          key={index}
          style={styles.row}
          onPress={() => {
            setActiveHabitItemIndex(index);
            setModalVisible(true);
          }}
        >
          <View style={styles.box}>
            <Ionicons
              name={(habitItems[index]?.iconName as any) || "add"}
              size={BOX_SIZE * 0.5}
              color={theme.colors.textSecondary}
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.placeholder}>
              {habitItems[index] ? habitItems[index].habitName : "Add a Habit"}
            </Text>
            <Text style={styles.subtitlePlaceholder}>
              {habitItems[index] ? habitItems[index].habitDescription : null}
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
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  <GenericForm
                    fields={fields}
                    onValueChange={(key, value) => {
                      setValues((prev: any) => ({ ...prev, [key]: value }));
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
                      habitsFrequency[activeHabitItemIndex] || [
                        "Sun",
                        "Mon",
                        "Tue",
                        "We",
                        "Thu",
                        "Fri",
                        "Sat",
                      ]
                    }
                    onChangeValues={setValues}
                  />

                  <Text style={styles.formLabel}></Text>
                  {/* <WeekdayFrequencyPicker /> */}
                  <CTAButton
                    title={"Submit"}
                    disabled={values.habitName ? false : true}
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
    formLabel: {
      ...theme.text.body,
      color: theme.colors.text,
      marginBottom: theme.spacing.s,
    },
    space: {
      marginVertical: theme.spacing.m,
    },
    spaceSmall: {
      marginVertical: theme.spacing.s,
    },
    headerLabel: {
      ...theme.text.body,
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.textSecondary,
      letterSpacing: 0.5,
      textTransform: "uppercase",
      marginBottom: theme.spacing.m,
    },
  });
}
