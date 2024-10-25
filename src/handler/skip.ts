import { useQueue } from "discord-player";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

const skip = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Pula a musica"),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const queue = useQueue(interaction.guild!);

    if (!queue?.isPlaying()) {
      await interaction.editReply("Sem musica tocando no momento");
      return;
    }

    queue?.node.skip();

    await interaction.editReply("Musica pulada!");
  },
};

export default skip;
