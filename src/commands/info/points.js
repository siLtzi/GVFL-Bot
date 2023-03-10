const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const leaderboardModel = require('../../models/2023');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("points")
    .setDescription("Shows your points and placement on the leaderboard for current season")
    .addUserOption((option) =>
      option.setName("user")
        .setDescription("The user to check points for")
        .setRequired(true)
    )
    .setDMPermission(false),
    async execute(interaction) {
        let id;
        let username;
        let userData;
        try{
            userData = await leaderboardModel.findOne({ userID: interaction.options.getUser("user").id });
            if (!userData) {
                userData = await leaderboardModel.create({
                userID: interaction.options.getUser("user").id,
                userName: interaction.options.getUser("user").username
            });
        }
        }  catch(err){
            console.log(err);
        }

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
        
        let color = "Green";
        if (memberIdx === 0) {
            color = "Gold";
        } else if (memberIdx === 1) {
            color = "LightGrey";
        } else if (memberIdx === 2) {
            color = "DarkOrange";
        }
        const embed = interaction.reply({embeds: [
            new EmbedBuilder()
                .setDescription(`${username} has ${points} points and is ranked #${memberIdx + 1} on the 2023 season with \n \n ${leaderboardData.firstPlace} \xa0\xa0first place finishes\n\n ${leaderboardData.secondPlace} \xa0\xa0second place finishes\n\n ${leaderboardData.thirdPlace} \xa0\xa0third place finishes`)
                .setColor(color)
                .setTitle("Season 2023 points and placements")
        ]
    });
    }
}