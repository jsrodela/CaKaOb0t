const scriptName = "bot3";

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
	if (msg === "!") {
		replier.reply("Hello, World!");
	} else if (msg == '!홍성범') {
        	replier.reply("간지");
	} else if (msg == '!홍기석') {
        replier.reply("대가리 몽키~");
    }
    if (msg == '!ping') {
        replier.reply("!pong "+room);
    }
}