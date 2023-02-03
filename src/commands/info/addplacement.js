const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const leaderboardModel = require('../../models/leaderboardSchema');
const leaderboard2023 = require('../../models/2023');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("addplacement")
    .setDescription("Add placement to a user")
    .addUserOption((option) =>
      option.setName("user")
        .setDescription("The user to add placement to")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option.setName("placement")
        .setDescription("The placement to add (1st, 2nd, 3rd)")
        .setRequired(true)
        .addChoices(
            {name: "1st", value: 1},
            {name: "2nd", value: 2},
            {name: "3rd", value: 3}           
        )
    ),

    async execute(interaction) {
        const user = interaction.options.getUser("user");
        const userId = user.id;
        const username = user.username;
    
        const placement = Number(interaction.options.getNumber("placement"));
        let points = 0;
        let placementKey = 0;
    
        switch (placement) {
        case 1:
            points = 3;
            placementKey = "first";
            break;
        case 2:
            points = 2;
            placementKey = "second";
            break;
        case 3:
            points = 1;
            placementKey = "third";
            break;
        default:
            return interaction.reply({
            embeds: [new EmbedBuilder().setDescription(`Invalid placement: ${placement}. Placement must be 1st, 2nd, or 3rd.`).setColor("Red")]
            });
        }
        
        try {
            await Promise.all([
                leaderboardModel.findOneAndUpdate(
                    { userID: userId },
                    { $inc: { [placementKey]: 1, points: points, [`${placementKey}Place`]: 1 }, $set: {userName: username } },
                    { upsert: true, new: true }
                ),
                leaderboard2023.findOneAndUpdate(
                    { userID: userId },
                    { $inc: { [placementKey]: 1, points: points, [`${placementKey}Place`]: 1 }, $set: {userName: username } },
                    { upsert: true, new: true }
                )
            ]);
        } catch (error) {
            console.error(error);
            return interaction.reply({
                embeds: [new EmbedBuilder().setDescription(`Error updating leaderboard: ${error}`).setColor("Red")]
            });
        }
        const profile = await leaderboardModel.findOne({ userID: userId });
        return interaction.reply({
            embeds: [new EmbedBuilder().setDescription(`Added placement ${placement} to ${username}. Total points: ${profile.points}.`).setColor("Green")]
        });
    }
};