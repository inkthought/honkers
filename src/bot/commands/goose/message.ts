import Command from "../../struct/Command";
import { Message } from "discord.js";
import messages from "../../../messages/messages";

abstract class Messages extends Command {
  constructor() {
    super({
      name: "message",
      usage: "message",
      cooldown: 3,
      aliases: ["msg", "messages"],
      description: "Get a goose message.",
      category: "Fun",
    });
  }

  async exec(message: Message) {
    return message.channel.send(
      messages[Math.floor(Math.random() * messages.length)]
    );
  }
}
export default Messages;
