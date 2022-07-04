import { Client, Collection } from "discord.js";
import {
  CommandRegistry,
  EventRegistry,
} from "../struct/registries/export/RegistryIndex";
import { CommandOptions, EventOptions } from "../types/Options";
import settings from "../settings";
import Redis from "ioredis";
import { Prisma, PrismaClient } from "@prisma/client";

class Bot extends Client {
  public prefix: string;
  public cache: Redis.Redis;
  public db: Prisma.MainDelegate<
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;

  public commands = new Collection<string, CommandOptions>();

  public cooldowns = new Collection<string, Collection<string, number>>();

  public events = new Collection<string, EventOptions>();

  public constructor() {
    super({
      /* Discord JS Client Options */
      disableMentions: "everyone",
    });

    this.db = new PrismaClient().main;
    this.cache = settings
      ? new Redis({
          port: settings.REDIS_PORT,
        }).once("ready", () => console.log("[Cache] Ready."))
      : new Redis().once("ready", () => console.log("[Cache] Ready."));
  }

  public start() {
    CommandRegistry(this);
    EventRegistry(this);
    super.login(settings.BOT_TOKEN);
  }
}

export default Bot;
