import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@/utils/theme/ThemeContext";
import { FormValuesType } from "@/utils/types";
import { Theme } from "@/utils/theme/themes";
import { Ionicons } from "@expo/vector-icons";

type FormField = {
  label: string;
  placeholder: string;
  key: string;
  required?: boolean;
  secureTextEntry?: boolean;
};

type CustomEditHabitFormProps = {
  fields: FormField[];
  onValueChange: (key: string, value: string) => void;
  values?: FormValuesType;
  errors?: Record<string, string>;
};

export default function CustomEditHabitForm({
  fields,
  onValueChange,
  values = {},
  errors = {},
}: CustomEditHabitFormProps) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [editingFieldKey, setEditingFieldKey] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      {fields.map((field) => {
        const isEditing = editingFieldKey === field.key;
        const value = (values as any)[field.key] || "";

        return (
          <View key={field.key} style={styles.fieldContainer}>
            <Text style={styles.label}>
              {field.label}
              {isEditing && field.required && (
                <Text style={styles.required}> *</Text>
              )}
            </Text>

            {isEditing ? (
              <TextInput
                style={[styles.input, errors[field.key] && styles.inputError]}
                placeholder={field.placeholder}
                placeholderTextColor={theme.colors.placeholder}
                value={value}
                onChangeText={(text) => onValueChange(field.key, text)}
                secureTextEntry={field.secureTextEntry}
                autoFocus
                onBlur={() => setEditingFieldKey(null)}
              />
            ) : (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setEditingFieldKey(field.key)}
                style={styles.staticInputContainer}
              >
                <Text
                  style={
                    value ? styles.staticInputText : styles.placeholderText
                  }
                  numberOfLines={1}
                >
                  {value || field.placeholder}
                </Text>
                <Ionicons
                  name="pencil"
                  size={18}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            )}

            {errors[field.key] && !isEditing && (
              <Text style={styles.errorText}>{errors[field.key]}</Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      width: "100%",
    },
    fieldContainer: {
      marginBottom: theme.spacing.l,
    },
    label: {
      ...theme.text.body,
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.textSecondary,
      letterSpacing: 0.5,
      textTransform: "uppercase",
      marginBottom: theme.spacing.s,
    },
    required: {
      color: theme.colors.error,
    },
    input: {
      backgroundColor: theme.colors.input,
      borderRadius: theme.radius.m,
      padding: theme.spacing.m,
      ...theme.text.body,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      minHeight: 52,
    },
    staticInputContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      // This container has no height or background, so it just wraps the text.
    },
    staticInputText: {
      ...theme.text.body,
      color: theme.colors.text,
      flex: 1,
      marginRight: theme.spacing.s,
    },
    placeholderText: {
      ...theme.text.body,
      color: theme.colors.placeholder,
      flex: 1,
      marginRight: theme.spacing.s,
    },
    inputError: {
      borderColor: theme.colors.error,
    },
    errorText: {
      ...theme.text.small,
      color: theme.colors.error,
      marginTop: theme.spacing.s,
    },
  });
}
