const scriptName = "bot3";

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
<<<<<<< HEAD
	if (msg === "!") {
		replier.reply("Hello, World!");
	} else if (msg == '!홍성범') {
        	replier.reply("간지");
	} else if (msg == '!홍기석') {
        replier.reply("대가리 몽키~");
    }
=======
    if (msg == '!ping') {
        replier.reply("!pong "+room);
    }

>>>>>>> a050cca26966f9ca3ace6526d3683c940f851453
}