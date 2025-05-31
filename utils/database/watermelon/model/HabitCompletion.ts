import { Model, Q } from "@nozbe/watermelondb";
import { field, text, writer } from "@nozbe/watermelondb/decorators";

export default class HabitCompletion extends Model {
  static table = "habit_completions";

  @text("habit_id") habitId!: string;
  @field("times_completed") timesCompleted!: number;
  @field("times_missed") timesMissed!: number;

  @writer async incrementTimesCompleted() {
    await this.update((record) => {
      record.timesCompleted += 1;
    });
  }

  @writer async decrementTimesCompleted() {
    await this.update((record) => {
      if (record.timesCompleted > 1) {
        // only do this operation if it won't result into negative
        record.timesCompleted -= 1;
      }
    });
  }

  @writer async incrementTimesMissed() {
    await this.update((record) => {
      record.timesMissed += 1;
    });
  }

  @writer async decrementTimesMissed() {
    await this.update((record) => {
      if (record.timesMissed > 1) {
        // only do this operation if it won't result into negative
        record.timesMissed -= 1;
      }
    });
  }
}
