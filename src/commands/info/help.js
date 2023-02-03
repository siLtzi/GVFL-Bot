const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows a list of commands")
        .setDMPermission(false),
    async execute(interaction) {
        let embed = new EmbedBuilder().setTitle("GVFL Bot Commands").setColor("Green");
        let commands = "";
        interaction.client.commands.forEach(command => {
            commands += `/${command.data.name} - ${command.data.description}\n`;
        });
        embed.setDescription(commands);
        return await interaction.reply({embeds: [embed]});
    }
}