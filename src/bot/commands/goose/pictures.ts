import Command from "../../struct/Command";
import { Message } from "discord.js";
import images from "../../../messages/images";

abstract class Pictures extends Command {
  constructor() {
    super({
      name: "picture",
      usage: "picture",
      cooldown: 3,
      aliases: ["pics", "pictures", "pic", "images", "image"],
      description: "View pictures of geese.",
      category: "Fun",
    });
  }

  async exec(message: Message) {
    return message.channel.send(
      images[Math.floor(Math.random() * images.length)]
    );
  }
}
export default Pictures;
