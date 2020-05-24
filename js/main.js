const app = new Vue({
    el: "#app",
    data: {
        name: '',
        prefix: '',
        description: '',
        body: '',
        result: '',

        nameError: '',
        prefixError: '',
        descriptionError: '',
        bodyError: '',

        selected: '    ',
        options: [
            { text: 'Space:2', value: '  ' },
            { text: 'Space:4', value: '    ' },
            { text: 'Tab', value: '\t' }
        ],

        errors: [],
    },
    methods: {
        initError: function () {
            this.errors = [];
            this.nameError = '';
            this.prefixError = '';
            this.descriptionError = '';
            this.bodyError = '';
        },

        generateSnippet: function () {
            // 初期化
            this.result = '';

            // バリデーションチェック
            this.validator();
            if (this.errors.length > 0) {
                console.log(this.errors);
                this.showError();
                return;
            }

            // jsonオブジェクトの生成
            const name = this.name;
            const obj = {};
            obj.prefix = this.prefix;
            obj.description = this.description;
            obj.body = this.trimIndent(this.body);

            this.result = `"${name}": ${JSON.stringify(obj, null, '\t')},`;

            // クリップボードにコピー
            if(navigator.clipboard){
                navigator.clipboard.writeText(this.result);
            }
        },

        trimIndent: function (code) {
            // コードを行ごとに配列化
            const codeArray = this.convertTextToArray(code);

            // 1行目からindent幅を取得
            const reg = /^[ |\t]*/;
            const indent = codeArray[0].match(reg);

            return codeArray.map(line => {
                const trimLine = indent[0] ? line.replace(indent[0], '') : line;
                const adjustLine = this.adjustIndent(trimLine);
                return adjustLine;
            });
        },

        adjustIndent: function (line) {
            const reg = new RegExp(this.selected, 'g');
            return line.replace(reg, '\t');
        },

        convertTextToArray: function (text) {
            const reg = new RegExp('\r\n|\r|\n', 'g');
            if (reg.test(text) === false) return [text];

            const tmp = text.replace(reg, '\n');
            return tmp.split('\n');
        },

        validator: function () {
            this.initError();

            // nameの入力チェック 必須 日本語可
            if (!this.name) {
                this.errors.push(new InputError('nameError', '入力してください'));
            }

            // prefixの入力チェック  必須 半角小文字英数字記号一部
            if (!this.prefix) {
                this.errors.push(new InputError('prefixError', '入力してください'));
            }

            // bodyの入力チェック 必須
            if (!this.body) {
                this.errors.push(new InputError('bodyError', '入力してください'));
            }

            // nameの文字数チェック 20文字以下
            if (this.name.length > 20) {
                this.errors.push(new InputError('nameError', '20文字以下で入力してください'));
            }
            // prefixの文字数チェック 10文字以下
            if (this.prefix.length > 20) {
                this.errors.push(new InputError('prefixError', '20文字以下で入力してください'));
            }
            // descriptionの文字数チェック 50文字以下
            if (this.description.length > 50) {
                this.errors.push(new InputError('descriptionError', '50文字以下で入力してください'));
            }
        },

        showError: function () {
            for (const err of this.errors) {
                this[err.target] = err.message;
            }
        },
    },

    computed: {
        nameErrorMessage: function () {
            return this.nameError;
        },
        prefixErrorMessage: function () {
            return this.prefixError;
        },
        descriptionErrorMessage: function () {
            return this.descriptionError;
        },
        bodyErrorMessage: function () {
            return this.bodyError;
        },
        
    }
});

class InputError {
    constructor(target, message) {
        this.target = target;
        this.message = message;
    }
}