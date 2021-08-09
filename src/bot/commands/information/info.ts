import Command from "../../struct/Command";
import { Message, MessageEmbed } from "discord.js";
// @ts-ignore - sorry, compiler
import { version } from "../../../../package.json";

abstract class Info extends Command {
  constructor() {
    super({
      name: "info",
      usage: "info",
      cooldown: 3,
      aliases: ["about", "information"],
      description: "Get information about the bot.",
      category: "Information",
    });
  }

  async exec(message: Message) {
    const application = await this.client.fetchApplication();

    let totalSeconds = this.client.uptime! / 1000;
    const days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const uptime =
      days +
      " days, " +
      hours +
      " hours, " +
      minutes +
      " minutes, and " +
      seconds +
      " seconds";

    const embed = new MessageEmbed()
      .setTitle("Information")
      .setColor("RANDOM")
      .addFields(
        {
          name: "Owner and Developer",
          value: "[geneva#0058](https://marcuscodes.me/)",
          inline: true,
        },
        {
          name: "Created At",
          value: application.createdAt.toLocaleString(),
          inline: true,
        },
        {
          name: "Created With",
          value:
            "<:djs:874328840741208195> Discord.js, <:ts:874329131884613653> TypeScript, <:prisma:874329428606472212> Prisma, <:pg:874329656470425670> PostgreSQL, <:redis:874329978559430816> Redis",
          inline: true,
        },
        {
          name: "Version",
          value: version,
          inline: true,
        },
        {
          name: "Invite",
          value: `[Click here](https://discord.com/oauth2/authorize?client_id=${application.id}&scope=bot&permissions=2147875920)`,
          inline: true,
        },
        {
          name: "Get Support",
          value: "[Join our server](https://discord.gg/GxfQh7H)",
        },
        {
          name: "Uptime",
          value: uptime,
          inline: true,
        }
      );

    return message.channel.send(embed);
  }
}
export default Info;
