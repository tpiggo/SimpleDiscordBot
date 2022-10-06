require("dotenv").config(); //to start process from .env file
const { Client, Message, GatewayIntentBits, ClientUser} = require("discord.js");
const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const TYPES = {
    add: "!add",
    list: "!list"
}


var userMap = {}

class UserScore {
    user;
    score;

    /**
     * 
     * @param {ClientUser} user 
     * @param {number} score 
     */
    constructor(user, score) {
        this.score = 1;
        if (score) {
            this.score = Number(score);
        }
        
        this.user = user;
    }
    
    addTotal(num) {
        this.score += Number(num);
    }
}

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

function getOrder(){
    let list = Object.keys(userMap).map(value => {
        let userScore = userMap[value];
        return {key: value, score: userScore.score, user: userScore.user}
    });
    console.log(list);
    list.sort((userScore, nextUserScore) => {
        return userScore.score > nextUserScore.score;
    });

    return list.slice(0, 3);
}

/**
 * Handles the message and then calling the next function
 * @param {Message<boolean>} message
 * @param {(message: Message<boolean>) => void} next  
 */
function handleSelf(message, next) {
    if (message.author.id != client.application.id && next != undefined) {
        return next(message)
    }
}

/**
 * @param {Message<boolean>} message
 * 
 */
function handleCommandWithArguments(message) {
    let response = undefined;
    console.log(message)
    let mySplit = message.content.split(" ");

    if (mySplit.length == 0) {
        console.log("Read empty message?");
        return;
    }

    mySplit = mySplit.filter(item => item.length != 0);
    let authorId = message.author.id;
    switch (mySplit[0]) {
        case TYPES.add:
            if (userMap[authorId] != undefined) {
                userMap[authorId].addTotal(mySplit[1])
            } else {
                userMap[authorId] = new UserScore(message.author, mySplit[1]);
            }
            response = `${userMap[authorId].user} has score ${userMap[authorId].score}`;
            break;
        case TYPES.list:
            let orderUsers = getOrder();
            response = orderUsers.map((userObj, index) => `${index + 1}: ${userObj.user} with score ${userObj.score}`).join("\n");
            console.log(response);
            break;
        default:
            console.log(`Unable to handle request for ${message.content}`);
            return;
    }   
    if (response) {
        message.reply(response);
    }
}

client.on("messageCreate", message => handleSelf(message, handleCommandWithArguments));

client.login(process.env.TOKEN);