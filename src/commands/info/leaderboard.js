const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const leaderboardModel = require('../../models/leaderboardSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Shows the top 10 players on the leaderboard")
        .setDMPermission(false),
    async execute(interaction) {
        const members = await leaderboardModel
            .find({})
            .sort({points: -1,firstPlace: -1,secondPlace: -1,thirdPlace: -1})
            .catch(err => console.log(err));

            let embed = new EmbedBuilder().setTitle("GVFL All-Time Leaderboard").setColor("Yellow").setFooter({text:"🏆 2022 Champion: Jiibe"});
            let leaderboard = "";
            let rank = 1;
            for (let i = 0; i < 10; i++) {
                if (members[i]) {
                    if (i > 0 && members[i].points === members[i-1].points && members[i].firstPlace === members[i-1].firstPlace && members[i].secondPlace === members[i-1].secondPlace && members[i].thirdPlace === members[i-1].thirdPlace) {
                        // do not increase the rank if points are equal to previous player's points
                    } else {
                        rank = i + 1;
                    }
                    const user = await interaction.client.users.fetch(members[i].userID);
                    leaderboard += `#${rank} \xa0 ${user.username} - ${members[i].points} points\xa0-\xa0🥇${members[i].firstPlace}\xa0\xa0 🥈${members[i].secondPlace}\xa0\xa0 🥉${members[i].thirdPlace}\n\n`;
                }
            }
            embed.setDescription(leaderboard);
            return await interaction.reply({embeds: [embed]});
    }
}
