import { Model, Q } from "@nozbe/watermelondb";
import { field, text, writer } from "@nozbe/watermelondb/decorators";

export default class HabitCompletion extends Model {
  static table = "habit_completions";

  @text("habit_id") habitId!: string;
  @field("times_completed") timesCompleted!: number;
  @field("times_missed") timesMissed!: number;
  @field("streak") streak!: number;
  @writer
  async incrementTimesCompleted() {
    await this.update((record) => {
      record.timesCompleted += 1;
      record.streak += 1;
    });
  }

  @writer async decrementTimesCompleted() {
    // for when the user un-checks the BouncyCheckbox
    await this.update((record) => {
      if (record.timesCompleted >= 1) {
        // only do this operation if it won't result into negative
        record.timesCompleted -= 1;
      }
      if (record.streak >= 1) {
        record.streak -= 1;
      }
    });
  }

  @writer async incrementTimesMissed(timesMissed: number) {
    await this.update((record) => {
      record.timesMissed += timesMissed; // taking input as we don't know when the user is going to open app after a long time
      // therefore programmatically calculate the number of days missed by the user

      record.streak = 0; // reset streak to 0 if the user misses a habit
    });
  }

  // @writer async decrementTimesMissed() { // shouldn't need this function, times missed is incremented by the system, no need to undo
  //   await this.update((record) => {
  //     if (record.timesMissed > 1) {
  //       // only do this operation if it won't result into negative
  //       record.timesMissed -= 1;
  //     }
  //   });
  // }
}
