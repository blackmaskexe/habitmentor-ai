import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { StyleSheet, useColorScheme, View, Alert } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useTheme } from "@/utils/theme/ThemeContext";

import HabitItemSheet from "./HabitItemSheet";
import { HabitObject } from "@/utils/types";
import { Theme } from "@/utils/theme/themes";
import mmkvStorage from "@/utils/mmkvStorage";
import { getHabitObjectFromId, updateEditedHabit } from "@/utils/habits";
import { useNotifications } from "@/utils/hooks/useNotifications";

export type HabitSheetRef = {
  presentWithData: (payload: {
    habit: HabitObject;
    habitDate: Date;
    initialDisplayScreen?: "main" | "reminder" | "editHabit";
    backdropCloseCallback: () => void;
  }) => void;
  dismiss: () => void;
};

export const HabitSheetModal = forwardRef<HabitSheetRef>((props, ref) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const theme = useTheme();
  const styles = createStyles(theme);
  const [payload, setPayload] = useState<{
    habit: HabitObject;
    habitDate: Date;
    initialDisplayScreen?: "main" | "reminder" | "editHabit";
    backdropCloseCallback: () => void;
  } | null>(null);

  useImperativeHandle(ref, () => ({
    presentWithData: (data) => {
      setPayload(data);
      bottomSheetRef.current?.present();
    },
    dismiss: () => {
      bottomSheetRef.current?.dismiss();
    },
  }));

  const { cancelAllScheduledNotifications, schedulePushNotification } =
    useNotifications();

  const renderBackdrop = useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...backdropProps}
        pressBehavior="close" // <== This makes tapping outside close the modal
        // optionally: you can use onPress to do something before closing
        onPress={() => {
          // maybe log or animate something
          // then optionally close
          // But the pressBehavior="close" handles the closing automatically
          // payload?.backdropCloseCallback();
        }}
      />
    ),
    []
  );
  const colorScheme = useColorScheme();
  const pillColor = colorScheme === "dark" ? "#424242" : "#DDDDDD"; // the official iOS colors for the navigation pill to be consistent

  return (
    <BottomSheetModal
      backdropComponent={renderBackdrop}
      ref={bottomSheetRef}
      snapPoints={["60%"]}
      enableDynamicSizing={true}
      backgroundStyle={{
        backgroundColor: theme.colors.background,
        borderRadius: 16,
      }}
      handleIndicatorStyle={{
        backgroundColor: pillColor,
      }}
      onDismiss={() => {
        payload?.backdropCloseCallback();

        // if the habit was edited
        const editedHabitStagedChanges = mmkvStorage.getString(
          "stagedEditHabitChanges"
        );
        const editedHabit: {
          habitId: string;
          habitName: string;
          habitDescription: string;
          habitFrequency: boolean[];
        } = JSON.parse(editedHabitStagedChanges || "{}");

        const oldHabit = getHabitObjectFromId(editedHabit.habitId)!;
        // checking if there are even changes in the habit in the menu:
        let didUserEditHabit = null;
        if (
          oldHabit.habitName == editedHabit.habitName &&
          JSON.stringify(editedHabit.habitFrequency) ==
            JSON.stringify(oldHabit.frequency) &&
          (oldHabit.habitDescription || "") == editedHabit.habitDescription
        ) {
          didUserEditHabit = false;
        } else {
          didUserEditHabit = true;
        }

        if (editedHabitStagedChanges && didUserEditHabit) {
          Alert.alert(
            "Save Changes",
            "Do you want to save your changes?",
            [
              {
                text: "Cancel",
                style: "cancel",
                onPress: () => {
                  // Do nothing - user chose to cancel
                },
              },
              {
                text: "Yes",
                onPress: async () => {
                  mmkvStorage.delete("stagedEditHabitChanges");

                  await updateEditedHabit(
                    editedHabit.habitId,
                    editedHabit.habitName,
                    editedHabit.habitDescription,
                    editedHabit.habitFrequency,
                    cancelAllScheduledNotifications,
                    schedulePushNotification
                  );
                },
              },
            ],
            { cancelable: true }
          );
        }
      }}
    >
      <BottomSheetView style={styles.bottomSheetContainer}>
        {/* <NavigationPill /> */}
        {payload && (
          <HabitItemSheet
            habit={payload.habit}
            habitDate={payload.habitDate}
            initialDisplayScreen={payload.initialDisplayScreen}
            dismiss={() => bottomSheetRef.current?.dismiss()}
          />
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

function createStyles(theme: Theme) {
  return StyleSheet.create({
    bottomSheetContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 8,
    },
  });
}
