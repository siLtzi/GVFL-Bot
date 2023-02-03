const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const leaderboardModel = require('../../models/2023');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("seasonleaderboard")
        .setDescription("Shows the top 10 players on the leaderboard for current season")
        .setDMPermission(false),
    async execute(interaction) {
        const members = await leaderboardModel
            .find({})
            .sort({points: -1})
            .catch(err => console.log(err));

        let embed = new EmbedBuilder().setTitle("GVFL 2023 Leaderboard").setColor("Yellow");
        let leaderboard = "";
        for (let i = 0; i < 10; i++) {
            if (members[i]) {
                const user = await interaction.client.users.fetch(members[i].userID);
                leaderboard += `${i + 1}. ${user.username} - ${members[i].points} points\n`;
            }
        }
        embed.setDescription(leaderboard);
        return await interaction.reply({embeds: [embed]});
    }
}