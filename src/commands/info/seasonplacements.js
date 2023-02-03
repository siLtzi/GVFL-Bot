const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const leaderboardModel = require('../../models/2023');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("seasonplacements")
    .setDescription("Show the user's placements for current season")
    .setDMPermission(false)
    .addUserOption((option) =>
      option.setName("user")
        .setDescription("The user to retrieve placements for")
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const userId = user.id;
    const username = user.username;

    const profile = await leaderboardModel.findOne({ userID: userId });
    if (!profile) {
      return interaction.reply({
        embeds: [new EmbedBuilder().setDescription(`${username} does not have any placements information.`).setColor("Red")]
      });
    }

    let embed = new EmbedBuilder().setTitle(`Season 2023 placements for ${username}`).setColor("Green");
    let placements = "";

    if (profile.firstPlace) {
      placements += `${profile.firstPlace} first place finishes\n`;
    }
    if (profile.secondPlace) {
      placements += `${profile.secondPlace} second place finishes\n`;
    }
    if (profile.thirdPlace) {
      placements += `${profile.thirdPlace} third place finishes`;
    }
    if (!placements) {
      placements = "No placement finishes yet";
    }

    embed.setDescription(placements);

    return interaction.reply({ embeds: [embed] });
  }
};