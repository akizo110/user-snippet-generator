class TextFilter {
    constructor(...regExpList) {
        this.regExpList = regExpList;
        this.keepMapList = [];
    }

    // 保守したい正規表現リスト
    // this.textの一時変換、および、一時変換した文字列の辞書が完成する
    keep(text) {
        this.text = text;
        for (let regExp of this.regExpList) {
            let [tmpText, keepMap] = this.replaceTmp(this.text, regExp);
            this.text = tmpText;
            this.keepMapList.push(keepMap);
        }
    }

    replaceTmp(text, regExp) {
        const keepMap = this.getKeepMap(text, regExp);
        for (let [key, value] of keepMap) {
            text = this.multiReplace(text, value, key);
        }
        return [text, keepMap];
    }

    multiReplace(text, searchValue, replaceValue) {
        let isLoop = true;
        let repText = text;
        while(isLoop) {
            repText = text.replace(searchValue, replaceValue);
            // 変換前と変換後が同じ＝もう変換できる文字列はない
            if(repText === text) {
                isLoop = false;
            } else {
                text = repText;
            }
        }
        return repText;
    }

    getKeepMap(text, regExp) {
        const tmpSet = new Set();
        let match;
        while ((match = regExp.exec(text)) !== null) {
            tmpSet.add(match[0]);
        }

        const keepMap = new Map();
        for (const value of tmpSet) {
            let randString = this.getRandomString();

            // keyの重複は許さない
            while (keepMap.has(randString)) {
                randString = this.getRandomString();
            }
            keepMap.set(randString, value);
        }
        return keepMap;
    }

    // 置換する
    replace(searchValue, replaceValue) {
        this.text = this.text.replace(searchValue, replaceValue);
    }

    // 戻す
    reverse() {
        for (let keepMap of this.keepMapList) {
            for (let [key, value] of keepMap) {
                let reg = new RegExp(key, 'g');
                this.text = this.text.replace(reg, value);
            }
        }
        return this.text;
    }

    getRandomString() {
        const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let randomString = '';
        for (let i = 0; i < 10; i++) {
            let rand = Math.floor(Math.random() * (chars.length - 1));
            const char = chars[rand];
            randomString = randomString + char;
        }
        return randomString;
    }
}

const variables = [
    '$TM_SELECTED_TEXT',
    '$TM_CURRENT_LINE',
    '$TM_CURRENT_WORD',
    '$TM_LINE_INDEX',
    '$TM_LINE_NUMBER',
    '$TM_FILENAME',
    '$TM_FILENAME_BASE',
    '$TM_DIRECTORY',
    '$TM_FILEPATH',
    '$CLIPBOARD',
    '$WORKSPACE_NAME',
    '$CURRENT_YEAR',
    '$CURRENT_YEAR_SHORT',
    '$CURRENT_MONTH',
    '$CURRENT_MONTH_NAME',
    '$CURRENT_MONTH_NAME_SHORT',
    '$CURRENT_DATE',
    '$CURRENT_DAY_NAME',
    '$CURRENT_DAY_NAME_SHORT',
    '$CURRENT_HOUR',
    '$CURRENT_MINUTE',
    '$CURRENT_SECOND',
    '$CURRENT_SECONDS_UNIX',
    '$BLOCK_COMMENT_START',
    '$BLOCK_COMMENT_END',
    '$LINE_COMMENT',
];

const regExpVariables = [];
for(let variable of variables) {
    regExpVariables.push(new RegExp(`\\${variable}`, 'g'));
}

const paramRegExp = new RegExp('\\$\\{[0-9]*:[a-zA-Z]*\}', 'g');
const numberRegExp = new RegExp('\\$[0-9]', 'g');


let dollarMarkReplacer = new TextFilter(paramRegExp, numberRegExp, ...regExpVariables);

export { dollarMarkReplacer };
