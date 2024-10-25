import { useQueue } from "discord-player";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

const Stop = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Para a musica"),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const queue = useQueue(interaction.guild!);

    if (!queue?.isPlaying()) {
      await interaction.editReply("Sem musica tocando no momento");
      return;
    }

    queue?.delete();

    await interaction.editReply("Musica parada!");
  },
};

export default Stop;
