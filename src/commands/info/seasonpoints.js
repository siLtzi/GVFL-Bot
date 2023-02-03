const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const leaderboardModel = require('../../models/2023');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("seasonpoints")
    .setDescription("Shows your points and placement on the leaderboard for current season")
    .addUserOption((option) =>
      option.setName("user")
        .setDescription("The user to check points for")
        .setRequired(false)
    )
    .setDMPermission(false),
    async execute(interaction) {
        let id;
        let username;
        if (interaction.options.getUser("user")) {
            id = interaction.options.getUser("user").id;
            username = interaction.options.getUser("user").username;
        } else {
            id = interaction.user.id;
            username = interaction.user.username;
        }
        const leaderboardData = await leaderboardModel.findOne({ userID: id }).catch(err => console.log(err));
        let points;
        if (leaderboardData && leaderboardData.points) {
            points = leaderboardData.points;
        } else {
            points = 0;
        }
        const members = await leaderboardModel
          .find({})
          .sort({ points: -1 })
          .catch(err => console.log(err));
        
        const memberIdx = members.findIndex((member) => member.userID === id);
        return await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`${username} has ${points} points and is ranked #${memberIdx + 1} on the all-time GVFL leaderboard`).setColor("Green")] });
    }
}