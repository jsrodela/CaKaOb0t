const scriptName = "2";

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    if (msg == '!박서현') {
        replier.reply("!Hello"+room);
    }
    if (msg == '메롱') {
        replier.reply("메롱"+room);
    }
}