const scriptName = "bot2";
// bot2 by doii

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    if (msg === "!") {
        replier.reply("Hello, World!");
    } else if (msg == '!ping') {
        replier.reply("!pong "+room);
    } else if (msg.startsWith("!clone")) {
        replier.reply(msg.slice("!clone".length));
    }
}
