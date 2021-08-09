import Command from "../../struct/Command";
import { Message, MessageEmbed } from "discord.js";

let embed = new MessageEmbed().setColor("RANDOM").setTitle("Honk!");

abstract class Ping extends Command {
  constructor() {
    super({
      name: "ping",
      usage: "ping",
      aliases: ["p"],
      cooldown: 3,
      description: "Check latency.",
      category: "Information",
    });
  }

  async exec(message: Message) {
    await message.channel.send("*HONKKKKKK*").then(async (m) => {
      embed
        .addField(
          "Latency",
          m.createdTimestamp - message.createdTimestamp + " ms"
        )
        .addField("Discord API", Math.round(this.client.ws.ping) + " ms");

      await message.channel.send(embed);
      m.delete();

      return (embed = new MessageEmbed().setColor("RANDOM").setTitle("Honk!"));
    });
  }
}
export default Ping;
