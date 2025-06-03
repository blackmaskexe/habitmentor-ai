import { appSchema, tableSchema } from "@nozbe/watermelondb";

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "missed_habits",
      columns: [
        { name: "date_string", type: "string" },
        { name: "missed_habits_id_array", type: "string" }, // we will JSON.parse it to extract relevant information
      ],
    }),
    tableSchema({
      name: "important_messages",
      columns: [{ name: "important_message", type: "string" }],
    }),
    tableSchema({
      name: "habit_completions",
      columns: [
        { name: "habit_id", type: "string", isIndexed: true },
        { name: "habit_name", type: "string" },
        { name: "times_completed", type: "number" },
        { name: "times_missed", type: "number" },
        { name: "streak", type: "number" },
        { name: "prev_days_since_last", type: "number" }, // helper attribute, no real data collection value
      ],
    }),
  ],
});
