import * as SQLite from "expo-sqlite";

// Module-level variable to hold the database instance.
// It's initialized to null and will be populated once the database is ready.
let dbInstance = null;

// A promise that resolves with the database instance when initialization is complete.
// This is the core mechanism to manage asynchronous initialization without top-level await.
let initializeDbPromise = null;

// --- Database Initialization Logic ---

/**
 * Asynchronously sets up the database.
 * This function opens the database connection and creates necessary tables.
 * It's designed to be called only once.
 * @returns {Promise<SQLite.SQLiteDatabase>} A promise that resolves with the database instance.
 */
async function setupDatabase() {
  // Open the database connection. This was previously a top-level await.
  const db = await SQLite.openDatabaseAsync("databaseName");

  // Execute initial setup queries (PRAGMA, CREATE TABLE).
  // This was also part of the top-level awaited logic.
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS habitHistory (id INTEGER PRIMARY KEY NOT NULL, habitId TEXT NOT NULL, completionDate TEXT NOT NULL);
  `);

  // console.log("Database initialized and tables created successfully."); // Uncomment for debugging
  return db; // Return the initialized database instance.
}

/**
 * Gets the singleton database instance, initializing it if necessary.
 * This function ensures that `setupDatabase` is called only once and returns
 * the promise that resolves with the database instance.
 * @returns {Promise<SQLite.SQLiteDatabase>} A promise that resolves with the initialized database instance.
 */
function getDbInstance() {
  if (!initializeDbPromise) {
    // If the initialization promise doesn't exist, create it by calling setupDatabase.
    // This ensures setupDatabase() is only invoked the first time getDbInstance() is called.
    initializeDbPromise = setupDatabase();
  }
  // Return the promise. Functions needing the DB will await this promise.
  return initializeDbPromise;
}

// --- Start Database Initialization ---

// We initiate the database setup process as soon as this module is loaded.
// The .then() and .catch() here handle the result of the initialization.
// This does *not* block module loading because we are not awaiting `getDbInstance()` here.
getDbInstance()
  .then((db) => {
    dbInstance = db; // Store the resolved DB instance globally within this module.
    // console.log("Database instance is now globally available in this module."); // Uncomment for debugging
  })
  .catch((error) => {
    console.error("Critical: Failed to initialize database:", error);
    // Depending on your app's needs, you might want to throw an error here
    // or set a flag indicating that the database is unavailable.
    // For now, dbInstance will remain null, and operations will fail.
  });

// --- Exported Database Operations ---

/**
 * Marks a habit as complete for a given date.
 * @param {string} habitId - The ID of the habit.
 * @param {string} habitDate - The completion date (e.g., "YYYY-MM-DD").
 * @returns {Promise<SQLite.SQLiteRunResult>} The result of the insert operation.
 */
const onMarkAsComplete = async (habitId, habitDate) => {
  // Ensure the database is initialized before proceeding.
  // If dbInstance is already set (initialization finished), use it.
  // Otherwise, await the initialization promise.
  const currentDb = dbInstance || (await getDbInstance());

  // It's crucial to check if currentDb is actually available,
  // especially if initialization could have failed.
  if (!currentDb) {
    console.error("Database not initialized. Cannot mark habit as complete.");
    throw new Error(
      "Database is not available. Initialization might have failed."
    );
  }

  // Perform the database insert operation.
  const result = await currentDb.runAsync(
    "INSERT INTO habitHistory (habitId, completionDate) VALUES (?, ?)",
    habitId,
    habitDate
  );
  // console.log("Habit marked as complete. ID:", result.lastInsertRowId, "Changes:", result.changes);
  console.log("lirili larila, the clock goes tic tac"); // Your original log
  return result;
};

/**
 * Marks a habit as incomplete for a given date by deleting the record.
 * @param {string} habitId - The ID of the habit.
 * @param {string} habitDate - The date to mark as incomplete (e.g., "YYYY-MM-DD").
 * @returns {Promise<SQLite.SQLiteRunResult>} The result of the delete operation.
 */
const onMarkAsIncomplete = async (habitId, habitDate) => {
  // Ensure the database is initialized.
  const currentDb = dbInstance || (await getDbInstance());

  if (!currentDb) {
    console.error("Database not initialized. Cannot mark habit as incomplete.");
    throw new Error(
      "Database is not available. Initialization might have failed."
    );
  }

  // Perform the database delete operation.
  const result = await currentDb.runAsync(
    "DELETE FROM habitHistory WHERE habitId = ? AND completionDate = ?",
    habitId,
    habitDate
  );
  // console.log("Habit marked as incomplete. Changes:", result.changes);
  console.log("trippi troppi, troppo trippa"); // Your original log
  return result;
};

// Export the functions that components will use.
export { onMarkAsComplete, onMarkAsIncomplete };
