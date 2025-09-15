import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { StyleSheet, View } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";

// Component imports:
import NavigationPill from "../../../general/NavigationPill";

export type SuggestionsSheetPayloadData = {
  CustomComponent: React.ComponentType<any>;
  customProps?: Record<string, any>;
};

export type SuggestionsSheetRef = {
  presentWithData: (payload: SuggestionsSheetPayloadData) => void;
  dismiss: () => void;
};

export const SuggestionsSheetModal = forwardRef<SuggestionsSheetRef>(
  (props, ref) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const theme = useTheme();
    const styles = createStyles(theme);
    const [payload, setPayload] = useState<SuggestionsSheetPayloadData | null>(
      null
    );

    useImperativeHandle(ref, () => ({
      presentWithData: (data) => {
        setPayload(data);
        bottomSheetRef.current?.present();
      },
      dismiss: () => bottomSheetRef.current?.dismiss(),
    }));

    const renderBackdrop = useCallback(
      (backdropProps: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          {...backdropProps}
          pressBehavior="close"
        />
      ),
      []
    );

    return (
      <BottomSheetModal
        backdropComponent={renderBackdrop}
        ref={bottomSheetRef}
        snapPoints={[]}
        enableDynamicSizing={true}
        backgroundStyle={{
          backgroundColor: theme.colors.background,
          borderRadius: 16,
        }}
      >
        <BottomSheetView style={styles.bottomSheetContainer}>
          <NavigationPill />
          {payload && (
            <payload.CustomComponent {...(payload.customProps || {})} />
          )}
          <View style={styles.space} />
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

function createStyles(theme: Theme) {
  return StyleSheet.create({
    bottomSheetContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 8,
    },
    space: {
      marginVertical: theme.spacing.m,
    },
  });
}
