import { Message } from "discord.js";
import Command from "../../struct/Command";

abstract class Honkify extends Command {
  constructor() {
    super({
      name: "honkify",
      usage: "honkify [MESSAGE...]",
      cooldown: 3,
      aliases: ["goosify", "ify"],
      description: "Honkify your messages!",
      category: "Fun",
      requiredArgs: 1,
    });
  }

  async exec(message: Message, args: string[]) {
    let arr: string[] = [];

    for (let word of args) {
      if (
        word.toLowerCase().includes("fuck") ||
        word.toLowerCase().includes("heck") ||
        word.toLowerCase().includes("hell") ||
        word.toLowerCase().includes("fudge") ||
        word.toLowerCase().includes("damn")
      ) {
        arr.push("HONK");
      } else if (word.toLowerCase().includes("bitch")) {
        arr.push("goose");
      } else arr.push(word);
    }

    return message.channel.send(arr.join(" "));
  }
}
export default Honkify;
