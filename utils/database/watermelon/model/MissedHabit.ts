import { Model } from "@nozbe/watermelondb";
import { text } from "@nozbe/watermelondb/decorators";

export default class MissedHabits extends Model {
  static table = "missed_habits";

  @text("date_string") dateString!: string;
  @text("missed_habits_id_array") missedHabitsIdArray!: string;
}
