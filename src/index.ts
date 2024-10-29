import {
  ButtonComponent,
  ButtonInteraction,
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  Partials,
  REST,
  Routes,
  SlashCommandBuilder,
} from "discord.js";
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
} from "@discordjs/voice";
import { config } from "dotenv";
import commands from "./handler";
import { Player } from "discord-player";
import { YoutubeiExtractor } from "discord-player-youtubei";
config();

interface IGuildData {
  isPlaying: boolean;
}

interface Command {
  execute: () => Promise<String | void>;
  data: SlashCommandBuilder;
}

declare module "discord.js" {
  interface Client {
    guildData: Map<String, IGuildData>;
    commands: Collection<String, Command>;
  }
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
  ],
  partials: [Partials.Channel],
});

const player = new Player(client);
await player.extractors.register(YoutubeiExtractor, {
  
});
client.guildData = new Map();

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

const commandsJson = Array.from(commands.values()).map((command) =>
  command.data.toJSON()
);

client.on(Events.InteractionCreate, (interaction) => {
  console.log( interaction)
  if(interaction.isButton()) {
    if(interaction.customId === 'pauseButton') {
      commands.get('pause')
    }
  }
  if (!interaction.isChatInputCommand()) return;
  if (!interaction.guild) return;

  let handler = commands.get(interaction.commandName)!;
  handler.execute(interaction);
});

client.on("guildAvailable", (guild) => {
  client.guildData.set(guild.id, {
    isPlaying: false,
  });
  // console.log("Guild: ", guild.name, " : ", guild.id);
});

client.once("ready", () => {
  // console.log(`Online em: ${client.user?.tag}!`);
});

client.on(Events.InteractionCreate, (interaction) => {
  if (!interaction.isChatInputCommand()) return;
});

(async () => {
  try {
    // console.log(
    //   `Started refreshing ${commandsJson.length} application (/) commands.`
    // );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data: any[] = (await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID!,
        "1121454929576460389"
      ),
      { body: commandsJson }
    )) as any[];

    // console.log(
    //   `Successfully reloaded ${data.length} application (/) commands.`
    // );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();

client.login(process.env.DISCORD_TOKEN);
