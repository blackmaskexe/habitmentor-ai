import { Model } from "@nozbe/watermelondb";
import { text } from "@nozbe/watermelondb/decorators";

export default class HabitCompletionData extends Model {
  static table = "habit_completion_data";

  @text("habit_id") habitId!: string;
  @text("times_completed") timesCompleted!: string;
  @text("times_missed") timesMissed!: string;
}
