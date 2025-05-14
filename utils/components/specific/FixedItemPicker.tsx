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
import AsyncStorage from "@react-native-async-storage/async-storage";

// Components:
import GenericForm from "../general/GenericForm";
import CTAButton from "../general/CTAButton";
import WeekdayFrequencyPicker from "./WeekdayFrequencyPicker";

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

  const [habitItems, setHabitItems] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleNewHabitSubmission = function () {
    setModalVisible(false);
    const habitData = values;
    console.log("dig dig dig dig jigga jigga jig jig", habitData, values);
    habitData.iconName = getHabitIcon(habitData.habitName); // generate icons from a predetermined list
    setValues({}); // clearing form data upon submission

    // let response = null;
    // try {
    //   response = await api.post("/onboarding/get-ionicon", {
    //     habit: habitData.habit,
    //   }); // get the icon name from server before proceeding
    // } catch (err) {
    //   console.log(err);
    //   response = {
    //     data: {
    //       success: false,
    //     },
    //   };
    // }

    // if (habitItems.length <= 3) {
    setHabitItems((oldHabitItems: any) => {
      console.log(oldHabitItems, "so just leave me alona");
      const newHabitItems = [...oldHabitItems];
      newHabitItems[activeHabitItemIndex] = habitData;
      // newHabitItems[activeHabitItemIndex].iconName = response.data.success
      //   ? response.data.response
      //   : "checkmark-outline";

      return newHabitItems;
    });

    console.log(habitItems, "I am habit items");

    // }
  };

  useEffect(() => {
    if (habitItems.length == numRows) {
      // when all the habit items are filled, trigger the callback onAllHabitSelected passed from prop
      onAllHabitSelected();
      // as well as save eveything to the mmkv storage
      mmkvStorage.set("coreHabits", JSON.stringify(habitItems));
      mmkvStorage.set("activeHabits", JSON.stringify(habitItems));
      console.log("BUMMMMMMM", mmkvStorage.getString("coreHabits"));
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
              name={habitItems[index] ? habitItems[index].iconName : "add"}
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
                  <WeekdayFrequencyPicker />
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
  });
}
