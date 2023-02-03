const { Events } = require('discord.js');
const chalk = require('chalk');
const leaderboardModel = require('../models/leaderboardSchema');
const leaderboard2023 = require('../models/2023');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if(!interaction.isChatInputCommand()) return;

        let leaderboardData;
        let leaderboardData2023;
        try {
            leaderboardData = await leaderboardModel.findOne({ userID: interaction.user.id });
            leaderboardData2023 = await leaderboard2023.findOne({ userID: interaction.user.id });

            if(!leaderboardData) {
                leaderboardData = await leaderboardModel.create({
                    userID: interaction.user.id,
                    userName: interaction.user.username,
                    serverID: interaction.guild.id,
                    points: 0,
                    firstPlace: 0,
                    secondPlace: 0,
                    thirdPlace: 0
                });
            }

            if(!leaderboardData2023) {
                leaderboardData2023 = await leaderboard2023.create({
                    userID: interaction.user.id,
                    userName: interaction.user.username,
                    serverID: interaction.guild.id,
                    points: 0,
                    firstPlace: 0,
                    secondPlace: 0,
                    thirdPlace: 0
                });
            }
        } catch(e) {
            console.log(chalk.white(`[${chalk.red("SLASH")}]${chalk.white(" - ")}There was an error while executing an application command: ${e.stack}`))
        }


        const command = client.commands.get(interaction.commandName)
    
        if(!command) {
            console.log(chalk.white(`[${chalk.grey("SLASH")}]${chalk.white(" - ")}${chalk.red(`No command matching ${interaction.commandName} was found`)} `))
            return;
        }
    
        try {
            await command.execute(interaction, client)
        } catch(e) {
            console.log(chalk.white(`[${chalk.red("SLASH")}]${chalk.white(" - ")}There was an error while executing an application command: ${e.stack}`))
            try {
                await interaction.reply({ content: "There was an error while executing this command, please try again", ephemeral: true });
            } catch {
                return;
            }
        }
    }
}