import { Model } from "@nozbe/watermelondb";
import { text } from "@nozbe/watermelondb/decorators";

export default class MissedHabits extends Model {
  static table = "missed_habits";

  @text("date_string") dateString!: string;
  @text("times_completed") timesCompleted!: number;
  @text("times_missed") timesMissed!: number;
}
