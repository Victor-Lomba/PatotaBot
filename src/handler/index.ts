import {
  CacheType,
  ChatInputCommandInteraction,
  Interaction,
  SlashCommandBuilder,
} from "discord.js";
import ping from "./ping";
import play from "./play";
import Stop from "./stop";
import skip from "./skip";
// import pause from "./pause";

const commands: Map<
  string,
  {
    data: any;
    execute: (
      interaction: ChatInputCommandInteraction<CacheType>
    ) => Promise<void>;
  }
> = new Map();

commands.set("ping", ping);
commands.set("play", play);
commands.set("stop", Stop);
commands.set("skip", skip);
// commands.set("pause", pause);

export default commands;
