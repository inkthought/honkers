import { Guild } from "discord.js";
import Event from "../struct/Event";

abstract class GuildCreate extends Event {
  constructor() {
    super({
      name: "guildCreate",
    });
  }

  async exec(guild: Guild) {
    guild.channels.create("honk");
  }
}

export default GuildCreate;
