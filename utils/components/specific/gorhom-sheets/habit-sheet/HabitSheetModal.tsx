import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useTheme } from "@/utils/theme/ThemeContext";

import NavigationPill from "../../../general/NavigationPill";
import HabitItemSheet from "./HabitItemSheet";
import { HabitObject } from "@/utils/types";
import { Theme } from "@/utils/theme/themes";

export type HabitSheetRef = {
  present: (payload: {
    habit: HabitObject;
    habitDate: Date;
    initialDisplayScreen?: "main" | "reminder" | "editHabit";
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
  } | null>(null);

  useImperativeHandle(ref, () => ({
    present: (data) => {
      setPayload(data);
      bottomSheetRef.current?.present();
    },
    dismiss: () => bottomSheetRef.current?.dismiss(),
  }));

  if (!payload) return null;

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={["60%"]}
      backgroundStyle={{
        backgroundColor: theme.colors.background,
        borderRadius: 16,
      }}
    >
      <BottomSheetView style={styles.bottomSheetContainer}>
        <NavigationPill />
        <HabitItemSheet
          habit={payload.habit}
          habitDate={payload.habitDate}
          initialDisplayScreen={payload.initialDisplayScreen}
          dismiss={() => bottomSheetRef.current?.dismiss()}
        />
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
