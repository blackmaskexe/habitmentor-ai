import { Model } from "@nozbe/watermelondb";
import { text } from "@nozbe/watermelondb/decorators";

export default class ImportantMessage extends Model {
  static table = "important_messages";

  @text("important_message") importantMessage!: string;
}
