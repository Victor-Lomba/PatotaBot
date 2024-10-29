import { useQueue } from "discord-player";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

const pause = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pausa a música"),
  async execute(interaction: any) {
    console.log(">>>>>>>>>>>>pause")
    await interaction.deferReply();
    const queue = useQueue(interaction.guild!);

    if (!queue?.isPlaying()) {
      await interaction.editReply("Sem musica tocando no momento");
      return;
    }

    queue?.node.pause();

    await interaction.editReply("Musica parada!");
  },
};

export default pause;
