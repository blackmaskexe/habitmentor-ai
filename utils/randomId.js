import ShortUniqueId from "short-unique-id";

export const uid = new ShortUniqueId({ length: 10 });
export const messageid = new ShortUniqueId({ length: 16 });

export function generateHabitId() {
  return uid.rnd();
}

export function generateMessageId() {
  return messageid.rnd();
}
