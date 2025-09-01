import {
  schemaMigrations,
  addColumns,
} from "@nozbe/watermelondb/Schema/migrations";

export default schemaMigrations({
  migrations: [
    // Migration from version 1 to version 2
    {
      toVersion: 2,
      steps: [
        // Add created_at column to important_messages table
        addColumns({
          table: "important_messages",
          columns: [{ name: "created_at", type: "number" }],
        }),
      ],
    },
  ],
});
