const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const leaderboardModel = require('../../models/leaderboardSchema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("points")
    .setDescription("Shows your points and placement on the leaderboard")
    .setDMPermission(false),
    async execute(interaction, leaderboardData) {
        const { id, username } = interaction.user;
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
        
        const memberIdx = members.findIndex((member) => member.userId === id);
        return await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`${username} has ${points} points and is ranked #${memberIdx + 1} on the leaderboard`).setColor("Green")] });
    }
}