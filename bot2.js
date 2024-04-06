const scriptName = "bot2";
// bot2 by doii

const prefix = "!"

/**
 * @param { string } room 
 * @param { string } msg 
 * @param { string } sender 
 * @param { boolean } isGroupChat 
 * @param { ( content: string ) => void } replier 
 * @param { Object } imageDB 
 * @param { string } packageName 
 */
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    if (!msg.startsWith(prefix)) return; // prefix 로 메세지가 시작하지 않을경우 반환
    const command = msg.slice(1);

    if (command.startsWith("ping")) ping(replier, command);
    if (command.startsWith("check")) check(replier, sender, command);
}

function onCreate() {

}

function onStart() {
    updateDataBase("check.json", (content) => {
        if (!content.date) {
            content = {
                date: new Date().getDate(),
                checkedToday: [],
                dailyStrike: {}
            };
        }
        return content
    })
}

/**
 * 
 * @param { string } filename 
 * @param { (content: object) => object } func 
 */
function updateDataBase(filename, func) {
    const content = JSON.parse(getDataBase(filename));
    const result = func(content);
    setDataBase(filename, JSON.stringify(result))
}

/**
* 
* @param { {
*   date: number,
*   checkedToday: string[],
*   dailyStrike: { 
*        [key: string]: { 
*            current: number,
*            best: number
*        } 
*    },
* } } data 
*/
function updateCheckStatus(data) {
    if (data.date === new Date().getDate()) return; // 날짜가 바뀌었을때만 업데이트 진행
    data.checkedToday = []; // 오늘 체크 한 사람 목록 리셋

    data.date = new Date().getDate(); // 날짜 업데이트

    Object.keys(data.dailyStrike).forEach(p => {
        if (!data.checkedToday.includes(p)) data.dailyStrike[p].current = 0; // 오늘 체크 안한사람 연속 일수 리셋
    });

    return data; // 변경된 데이터 반환
}

/**
 * 
 * @param { string } command 
 */
function ping(replier, command) {
    const args = command.slice('ping'.length);

    replier.reply(args);
}

function check(replier, name, command) {
    updateDataBase("check.json", (content) => {
        if (!content.checkedToday.includes(name)) content.checkedToday.push(name)

        if (!data.dailyStrike[p]) { // 해당 사람의 데이터가 없다면 생성
            data.dailyStrike[p] = {
                current: 0,
                best: 0
            }
        }

        if (data.dailyStrike[p].best < data.dailyStrike[p].current) { // 현재 연속 일수가 최고 연속보다 클 경우 업데이트
            data.dailyStrike[p].best = data.dailyStrike[p].current;
        }

        const sender = result.dailyStrike[name];

        replier.reply(`출석 체크 ${sender.current}일 연속!
        당신의 최고 기록은 ${sender.best} 입니다!`);

        return result;
    })
}
