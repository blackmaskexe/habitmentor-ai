import { useTheme } from "@/utils/theme/ThemeContext";
import { Theme } from "@/utils/theme/themes";
import { FormValuesType } from "@/utils/types";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

/**
 * GenericForm Component
 *
 * A configurable form component that generates input fields based on provided configuration.
 *
 * @component
 *
 * @example
 * ```tsx
 * const fields = [
 *   {
 *     label: "Name:",
 *     placeholder: "Enter your name",
 *     key: "name",           // Unique identifier for the field
 *     required: true,        // Optional: mark field as required
 *     secureTextEntry: false // Optional: for password fields
 *   }
 * ];
 *
 * <GenericForm
 *   fields={fields}
 *   values={formValues}     // Optional: controlled form values
 *   errors={formErrors}     // Optional: error messages for fields
 * />
 * ```
 *
 * @typedef FormField
 * @property {string} label - Label text for the input field
 * @property {string} placeholder - Placeholder text for the input field
 * @property {string} key - Unique identifier for the field
 * @property {boolean} [required] - Whether the field is required
 * @property {boolean} [secureTextEntry] - Whether to hide the input text
 *
 * @typedef GenericFormProps
 * @property {FormField[]} fields - Array of field configurations
 * @property {(key: string, value: string) => void} onValueChange - Callback when field value changes
 * @property {Record<string, string>} [values] - Current form values
 * @property {Record<string, string>} [errors] - Error messages for fields
 * 
 * 
 * 
 * 
 * Usage Example:
 * import GenericForm from "@/utils/components/GenericForm";
 *
const fields = [
  {
    key: "name",
    label: "Name",
    placeholder: "Enter your name",
    required: true
  },
  {
    key: "password",
    label: "Password",
    placeholder: "Enter password",
    secureTextEntry: true,
    required: true
  }
];

function MyScreen() {
  const [values, setValues] = useState({});
  
  return (
    <GenericForm
      fields={fields}
      onValueChange={(key, value) => {
        setValues(prev => ({ ...prev, [key]: value }));
      }}
      values={values}
    />
  );
}
 */

type FormField = {
  label: string;
  placeholder: string;
  key: string;
  required?: boolean;
  secureTextEntry?: boolean;
};

type GenericFormProps = {
  fields: FormField[];
  onValueChange: (key: string, value: string) => void;
  values?: FormValuesType;
  errors?: Record<string, string>;
};

export default function GenericForm({
  fields,
  onValueChange,
  values = {},
  errors = {},
}: GenericFormProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {fields.map((field) => (
        <View key={field.key} style={styles.fieldContainer}>
          <Text style={styles.label}>
            {field.label}
            {field.required && <Text style={styles.required}> *</Text>}
          </Text>

          <TextInput
            style={[styles.input, errors[field.key] && styles.inputError]}
            placeholder={field.placeholder}
            placeholderTextColor={theme.colors.placeholder}
            value={(values as any)[field.key]}
            onChangeText={(text) => onValueChange(field.key, text)}
            secureTextEntry={field.secureTextEntry}
          />

          {errors[field.key] && (
            <Text style={styles.errorText}>{errors[field.key]}</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      width: "100%",
      // padding: theme.spacing.m,
    },
    fieldContainer: {
      marginBottom: theme.spacing.m,
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
      borderColor: theme.colors.border,
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
