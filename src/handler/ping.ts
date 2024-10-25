import {
  CacheType,
  ChatInputCommandInteraction,
  Interaction,
  SlashCommandBuilder,
} from "discord.js";

const ping = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Pinga a mãe pra ver se quica"),
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    let time = Math.abs(Date.now() - interaction.createdTimestamp);
    // interaction.reply(`Pong! ${time}ms`);
    interaction.reply(`Pong! ${time}ms`);
  },
} as const;

export default ping;
