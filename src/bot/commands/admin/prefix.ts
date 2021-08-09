import Command from "../../struct/Command";
import { Message } from "discord.js";

abstract class Prefix extends Command {
  constructor() {
    super({
      name: "prefix",
      aliases: ["setprefix", "changeprefix"],
      cooldown: 60,
      description: "Set the prefix of the server.",
      usage: "prefix [PREFIX]",
      userPermissions: ["MANAGE_GUILD"],
      requiredArgs: 1,
      category: "Administrator",
    });
  }

  async exec(message: Message, args: string[]) {
    const prefix = args.join(" ");

    return message.channel.send("Please wait... (honking)").then(async (m) => {
      m.edit("Please wait... (checking prefix)");
      if (args.join(" ").length > 15)
        return m.edit(
          "HONK HONK! Traffic goose here. Your prefix so long the goose started having trouble remembering it. Maybe shorten it? (15 characters or less)"
        );

      m.edit("Please wait... (finding prefix)");
      const oldPrefix = await this.client.db.findFirst({
        where: {
          server: message.guild?.id,
        },
      });

      m.edit("Please wait... (checking if custom prefix exists)");
      try {
        if (oldPrefix) {
          m.edit("Please wait... (found prefix, updating prefix...)");

          if (await this.client.cache.get(`honkers:${message.guild?.id}`))
            await this.client.cache.del(`honkers:${message.guild?.id}`);

          if (
            await this.client.cache.get(
              `honkers:donotsearch:${message.guild?.id}`
            )
          )
            await this.client.cache.del(
              `honkers:donotsearch:${message.guild?.id}`
            );

          await this.client.db.update({
            where: { server: message.guild?.id },
            data: {
              prefix,
            },
          });
        } else {
          m.edit("Please wait... (adding prefix to database)");

          if (
            await this.client.cache.get(
              `honkers:donotsearch:${message.guild?.id}`
            )
          )
            await this.client.cache.del(
              `honkers:donotsearch:${message.guild?.id}`
            );

          if (await this.client.cache.get(`honkers:${message.guild?.id}`))
            await this.client.cache.del(`honkers:${message.guild?.id}`);

          await this.client.db.create({
            data: {
              server: message.guild!.id,
              prefix,
            },
          });
        }
      } catch (e) {
        console.log(e);
        return m.edit(
          "QUACK. Goose started to faint so here's a duck as a replacement. Anyways, goose had trouble with saving the prefix to the database. Please try again and report this issue to us at https://inkthought.codes/discord/. Thanks!"
        );
      }
      return m.edit(
        ":ballot_box_with_check: Prefix has been successfully updated to " +
          prefix +
          ". From now on, use " +
          prefix +
          "help (or respective command) to use the bot."
      );
    });
  }
}
export default Prefix;
