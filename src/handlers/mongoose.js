const mongoose = require('mongoose');
const chalk = require('chalk');
const options = require('../options.json');

async function mongodb() {
    if(options.mongoose) {
        mongoose.set('strictQuery', true);

        mongoose.connect(process.env.mongoURL || '', {
            keepAlive: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => {
            console.log(chalk.white(`[${chalk.green("DATABASE")}]${chalk.white(" - ")}Successfully connected to mongoose`));
            console.log(" ");
        })
        .catch((error) => {
            console.error(chalk.red(`[${chalk.green("DATABASE")}]${chalk.white(" - ")}Connection to mongoose failed: ${error}`));
        });
    }
}

module.exports = mongodb;