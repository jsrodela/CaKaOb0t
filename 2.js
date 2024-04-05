const scriptName = "2";

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    if (msg == '!Hi') {
        replier.reply("!Hello"+room);
    }
    if (msg == '메롱') {
        replier.reply("메롱"+room);
    }
    if (msg == '!') {
        replier.reply("!hello "+room);
    }
}