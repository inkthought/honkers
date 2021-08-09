import Command from "../../struct/Command";
import { Message, MessageEmbed } from "discord.js";
import { stripIndents } from "common-tags";

abstract class Help extends Command {
  constructor() {
    super({
      name: "help",
      usage: "help [COMMAND]?",
      aliases: ["h"],
      cooldown: 3,
      description: "Display a list of all commands.",
      category: "Information",
    });
  }

  exec(message: Message, args: string[]) {
    const command = this.client.commands.get(args[0]);
    if (command) {
      const embed = new MessageEmbed().setColor("RANDOM");
      embed.setDescription(
        stripIndents(`
        **Name:** ${command.name}
        **Usage:** ${command.usage ? command.usage : "None"}
        **Aliases:** ${
          command.aliases?.length ? command.aliases.join(", ") : "None"
        }
        **Description:** ${command.description}
      `)
      );
      message.channel.send(embed);
    } else {
      const embed = new MessageEmbed().setColor("RANDOM");
      const categories = this.removeDuplicates(
        this.client.commands.map((c) => c.category)
      );
      for (const category of categories) {
        const commandNames: Array<string> = new Array();
        const commands = this.client.commands.filter(
          (c) => c.category === category
        );
        for (const command of commands) {
          if (!commandNames.includes(command[1].name)) {
            commandNames.push(command[1].name);
          }
        }
        embed.addField(category, commandNames.map((c) => `\`${c}\``).join(" "));
      }
      message.channel.send(embed);
    }
  }

  removeDuplicates(array: Array<string | undefined>) {
    return [...new Set(array)];
  }
}

export default Help;
