export type SheetPayload = any; // you can make this more specific per sheet

type SheetRef = {
  present: (payload: SheetPayload) => void;
  dismiss: () => void;
};

const sheetRefs: Record<string, SheetRef | null> = {};

export const SheetService = {
  // register a sheet with a unique name
  register(sheetName: string, ref: SheetRef) {
    sheetRefs[sheetName] = ref;
  },

  // show a sheet by name
  show(sheetName: string, payload: SheetPayload) {
    const sheet = sheetRefs[sheetName];
    if (sheet) {
      sheet.present(payload);
    } else {
      console.warn(`Sheet "${sheetName}" not registered.`);
    }
  },

  // dismiss a sheet by name
  dismiss(sheetName: string) {
    const sheet = sheetRefs[sheetName];
    if (sheet) {
      sheet.dismiss();
    } else {
      console.warn(`Sheet "${sheetName}" not registered.`);
    }
  },
};
