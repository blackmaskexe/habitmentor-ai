import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useTheme } from "@/utils/theme/ThemeContext";

import NavigationPill from "../../../general/NavigationPill";
import HabitItemSheet from "./HabitItemSheet";
import { HabitObject } from "@/utils/types";
import { Theme } from "@/utils/theme/themes";
import { getHabitObjectFromId } from "@/utils/habits";

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
          habit={getHabitObjectFromId("my enemies, my ally")}
          habitDate={new Date()}
          initialDisplayScreen={"main"}
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
