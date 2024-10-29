import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  NoSubscriberBehavior,
  StreamType,
} from "@discordjs/voice";
import { QueueRepeatMode, useMainPlayer } from "discord-player";
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandStringOption,
  VoiceChannel,
  ActionRowBuilder,
  Events,
} from "discord.js";
import yts from "yt-search";

const play = {
  async execute(interaction: ChatInputCommandInteraction) {
    const player = useMainPlayer();

    await interaction.deferReply();

    const song = interaction.options.getString("musica")!;
    const res = await yts(song);
    const related = await yts.search({ videoId: res.videos[0].videoId });
    // console.log(related);
    // console.log(res.videos);

    let defaultEmbed = new EmbedBuilder().setColor("#070858");

    if (!res.videos[0]) {
      defaultEmbed.setAuthor({
        name: `Nenhum resultado encontrado, tente novamente!`,
      });
      interaction.editReply({ embeds: [defaultEmbed] });
      return;
    }

    const member = interaction.guild!.members.cache.get(interaction.user.id)!;
    const songs = await yts(song);
    try {
      const { track } = await player.play(
        member.voice.channel!,
        songs.videos[0].url,
        {
          nodeOptions: {
            metadata: interaction,
            volume: 50,
            leaveOnEmpty: true,
            leaveOnEmptyCooldown: 30000,
            leaveOnEnd: true,
            leaveOnEndCooldown: 30000,
            repeatMode: QueueRepeatMode.AUTOPLAY,
          },
        }
      );

      // console.log(track);

      defaultEmbed.setAuthor({
        name: `Adicionada a fila`,
        iconURL: `${track.thumbnail}`,
        url: `${track.url}`
      })
      .setTitle(`${track.title}`)
      .setColor(`#070858`)
      .setDescription(`Duração: ${track.duration}`);

      const pauseButton = new ButtonBuilder()
      .setCustomId("pauseButton")
      .setLabel("Pausar")
      .setStyle(ButtonStyle.Secondary);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(pauseButton);

      await interaction.editReply({ embeds: [defaultEmbed], components: [row] });
    } catch (error) {
      // console.log(`Play error: ${error}`);
      defaultEmbed.setAuthor({
        name: `Não consigo entrar no canal de voz!`,
      });
      interaction.editReply({ embeds: [defaultEmbed] });
      return;
    }
  },

  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Toca musica")
    .addStringOption((option) =>
      option
        .setName("musica")
        .setDescription("Nome da musica ou url do youtube")
        .setRequired(true)
    ),
};

export default play;
