const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const leaderboardModel = require('../../models/leaderboardSchema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("addplacement")
    .setDescription("Add placement to a user")
    .addUserOption((option) =>
      option.setName("user")
        .setDescription("The user to add placement to")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option.setName("placement")
        .setDescription("The placement to add (1, 2, 3)")
        .setRequired(true)
    ),

    async execute(interaction) {
        const user = interaction.options.getUser("user");
        const userId = user.id;
        const username = user.username;

        const placement = parseInt(interaction.options.get("placement"), 10);
        let points = 0;
        let placementKey = 0;

        switch (placement) {
        case 1:
            points = 3;
            placementKey = 1;
            break;
        case 2:
            points = 2;
            placementKey = 2;
            break;
        case 3:
            points = 1;
            placementKey = 3;
            break;
        default:
            return interaction.reply({
            embeds: [new EmbedBuilder().setDescription(`Invalid placement: ${placement}. Placement must be 1, 2, or 3.`).setColor("Red")]
            });
        }

        const profile = await leaderboardModel.findOneAndUpdate(
        { userId: userId },
        { $inc: { [placementKey]: 1, points: points } },
        { upsert: true, new: true }
        );

        return interaction.reply({
            embeds: [new EmbedBuilder().setDescription(`Added placement ${placement} to ${username}. Total points: ${profile.points}.`).setColor("Green")]
        });
    }
};