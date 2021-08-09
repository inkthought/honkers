import Event from "../struct/Event";
import { Message, TextChannel, Guild, Collection, DMChannel } from "discord.js";
import settings from "../settings";
import messages from "../../messages/messages";

abstract class MessageEvent extends Event {
  constructor() {
    super({
      name: "message",
    });
  }

  async exec(message: Message) {
    if (message.author.bot || message.channel instanceof DMChannel) return;

    if (message.channel.name.includes("honk")) {
      if (message.content.toLowerCase().includes("honk")) {
        return message.channel.send(
          messages[Math.floor(Math.random() * messages.length)]
        );
      } else
        return message.delete({
          reason: 'Word was not "honk" in the honk channel.',
        });
    }

    let prefix: string = settings.DEFAULT_PREFIX;

    const doNotSearch = await this.client.cache.get(
      "honkers:donotsearch:" + message.guild?.id
    );

    const cachePrefix = await this.client.cache.get(
      "honkers:" + message.guild?.id
    );

    const dbPrefix = await this.client.db.findFirst({
      where: { server: message.guild!.id },
    });

    if (doNotSearch) {
    } else if (cachePrefix) prefix = cachePrefix;
    else if (dbPrefix) {
      prefix = dbPrefix.prefix;
      await this.client.cache.set(
        "honkers:" + message.guild!.id,
        dbPrefix.prefix
      );
    } else {
      await this.client.cache.set(
        "honkers:donotsearch:" + message.guild!.id,
        "true"
      );
    }

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName: string | undefined = args.shift();
    if (commandName) {
      const command = this.client.commands.get(commandName);
      if (command) {
        if (
          command.ownerOnly &&
          !settings.BOT_OWNER_ID.includes(message.author.id)
        ) {
          return;
        } else if (command.guildOnly && !(message.guild instanceof Guild)) {
          return message.channel.send(
            "This command can only be used in a guild."
          );
        }
        if (message.channel instanceof TextChannel) {
          const userPermissions = command.userPermissions;
          const clientPermissions = command.clientPermissions;
          const missingPermissions = new Array();
          if (userPermissions?.length) {
            for (let i = 0; i < userPermissions.length; i++) {
              const hasPermission = message.member?.hasPermission(
                userPermissions[i]
              );
              if (!hasPermission) {
                missingPermissions.push(userPermissions[i]);
              }
            }
            if (missingPermissions.length) {
              return message.channel.send(
                "You are missing required permissions."
              );
            }
          }
          if (clientPermissions?.length) {
            for (let i = 0; i < clientPermissions.length; i++) {
              const hasPermission = message.guild?.me?.hasPermission(
                clientPermissions[i]
              );
              if (!hasPermission) {
                missingPermissions.push(clientPermissions[i]);
              }
            }
            if (missingPermissions.length) {
              return message.channel.send(
                `*HONKKKKK* I\'m missing these required permissions: \`${missingPermissions.join(
                  ", "
                )}\`. Mind giving me them?`
              );
            }
          }
        }
        if (command.requiredArgs && command.requiredArgs > args.length) {
          return message.channel.send(
            `Invalid usage of this command. Please, refer to \`${prefix}help ${command.name}\``
          );
        }
        if (command.cooldown) {
          if (!this.client.cooldowns.has(command.name)) {
            this.client.cooldowns.set(command.name, new Collection());
          }
          const now = Date.now();
          const timestamps = this.client.cooldowns.get(command.name);
          const cooldownAmount = command.cooldown * 1000;
          if (timestamps?.has(message.author.id)) {
            const cooldown = timestamps.get(message.author.id);
            if (cooldown) {
              const expirationTime = cooldown + cooldownAmount;
              if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.channel.send(
                  `Wait ${timeLeft.toFixed(
                    1
                  )} more second(s) before reusing the \`${
                    command.name
                  }\` command.`
                );
              }
            }
          }
          timestamps?.set(message.author.id, now);
          setTimeout(
            () => timestamps?.delete(message.author.id),
            cooldownAmount
          );
        }
        try {
          console.log(
            "[Bot/Interaction] " + message.author.tag + " used " + command.name
          );
          return command.exec(message, args);
        } catch (error) {
          console.log("[Bot/Error]");
          console.log(error);
          message.channel.send(
            "There was an error running this command. Please try again, or if it still doesn't work, contact us at https://inkthought.codes/discord/."
          );
        }
      }
    }
  }
}

export default MessageEvent;
