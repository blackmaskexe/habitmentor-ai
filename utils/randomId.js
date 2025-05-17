import ShortUniqueId from "short-unique-id";

export const uid = new ShortUniqueId({ length: 10 });

export function generateHabitId() {
  return uid.rnd();
}
