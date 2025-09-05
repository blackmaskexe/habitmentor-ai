import { Model } from "@nozbe/watermelondb";
import { text, date } from "@nozbe/watermelondb/decorators";

export default class ImportantMessage extends Model {
  static table = "important_messages";

  @text("important_message") importantMessage!: string;
  @date("created_at") createdAt!: Date;
}
