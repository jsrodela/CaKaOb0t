
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    if (msg == '!') {
        replier.reply("!pong "+room);
    }
}

var learnedDataByRoom = {}; // 방별로 분리된 학습 데이터를 저장하는 객체
var teacherByRoom = {};
// 순환 참조를 검사하는 함수
function isCircularReference(room, key, value) {
    // 임시로 현재 key-value 쌍을 학습 데이터에 추가, 순환 참조 검사 후 제거
    var originalValue = learnedDataByRoom[room][key];
    learnedDataByRoom[room][key] = value; // 임시 추가

    var currentKey = value;
    while (currentKey in learnedDataByRoom[room]) {
        if (currentKey === key) {
            if (originalValue !== value) { // 원래 값으로 되돌림
                learnedDataByRoom[room][key] = originalValue;
            } else { // 새로운 학습이면 제거
                delete learnedDataByRoom[room][key];
            }
            return true; // 순환 참조 발견
        }
        currentKey = learnedDataByRoom[room][currentKey];
    }

    // 순환 참조가 없는 경우 원래 값으로 되돌림
    if (originalValue !== value) {
        learnedDataByRoom[room][key] = originalValue;
    } else {
        delete learnedDataByRoom[room][key];
    }
    return false; // 순환 참조 없음
}

function responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    if (msg.startsWith("!가르치기 ")) {
        var instruction = msg.substring(6).trim();
        var parts = instruction.split(":");
        if (parts.length == 2) {
            var key = parts[0].trim();
            var value = parts[1].trim(); 

            if (key.includes("!") || value.includes("!")) {
                replier.reply("명령어 실행을 방지하기 위해 '!'를 포함한 학습은 허용되지 않습니다.");
                return;
            } 

            if (!learnedDataByRoom[room]) {
                learnedDataByRoom[room] = {};
                teacherByRoom[room] = {};
            } 

            if (key === value) {
                replier.reply("무한 루프를 방지하기 위해 같은 단어로의 매핑은 불가능합니다.");
                return;
            } 

            if (isCircularReference(room, key, value)) {
                replier.reply("순환 참조를 방지하기 위해 학습을 거부합니다.");
                return;
            } 

            learnedDataByRoom[room][key] = value;
            if (!teacherByRoom[room][key]) {
                teacherByRoom[room][key] = [];
            }
            teacherByRoom[room][key].push(sender); // 가르친 사람 저장
            replier.reply("'" + key + "'을(를) '" + value + "'로 학습했습니다.");
        } else {
            replier.reply("잘못된 형식입니다. '!가르치기 [문자열1]:[문자열2]' 형식으로 입력해주세요.");
        }
    } else if (msg.trim() === "!가르치기로그") {
        // 가르친 데이터와 가르친 사람 출력
        var logMessage = "학습된 데이터:\n";
        if (learnedDataByRoom[room]) {
            for (var key in learnedDataByRoom[room]) {
                var value = learnedDataByRoom[room][key];
                var teachers = teacherByRoom[room][key].join(", ");
                logMessage += "'" + key + "': '" + value + "', 가르친 사람: " + teachers + "\n";
            }
        } else {
            logMessage += "없음";
        }
        replier.reply("\u200b".repeat(500)+logMessage.trim());
    } else {
        if (learnedDataByRoom[room] && msg.trim() in learnedDataByRoom[room]) {
            replier.reply(learnedDataByRoom[room][msg.trim()]);
        }
    }
}

function onNotificationPosted(sbn, sm) {
    var packageName = sbn.getPackageName();
    if (!packageName.startsWith("com.kakao.tal")) return;
    var actions = sbn.getNotification().actions;
    if (actions == null) return;
    var userId = sbn.getUser().hashCode();
    for (var n = 0; n < actions.length; n++) {
        var action = actions[n];
        if (action.getRemoteInputs() == null) continue;
        var bundle = sbn.getNotification().extras; 

        var msg = bundle.get("android.text").toString();
        var sender = bundle.getString("android.title");
        var room = bundle.getString("android.subText");
        if (room == null) room = bundle.getString("android.summaryText");
        var isGroupChat = room != null;
        if (room == null) room = sender;
        var replier = new com.xfl.msgbot.script.api.legacy.SessionCacheReplier(packageName, action, room, false, "");
        var icon = bundle.getParcelableArray("android.messages")[0].get("sender_person").getIcon().getBitmap();
        var image = bundle.getBundle("android.wearable.EXTENSIONS");
        if (image != null) image = image.getParcelable("background");
        var imageDB = new com.xfl.msgbot.script.api.legacy.ImageDB(icon, image);
        com.xfl.msgbot.application.service.NotificationListener.Companion.setSession(packageName, room, action);
        if (this.hasOwnProperty("responseFix")) {
            responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName, userId != 0);
        }
    }
}
