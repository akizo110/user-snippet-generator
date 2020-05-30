import { dollarMarkReplacer } from './regrest.js';

const app = new Vue({
    el: "#app",
    data: {
        name: '',
        prefix: '',
        description: '',
        body: '',
        result: '',
        showModal: false,
        message: '',

        namePlaceholder: 'Copyright',
        prefixPlaceholder: 'footer',
        descriptionPlaceholder: 'コピーライトのフッター',
        bodyPlaceholder: `<footer>
    <p class="copyright">2020 Akizo.</p>
</footer>`,


        nameError: '',
        prefixError: '',
        descriptionError: '',
        bodyError: '',

        selected: '  ',
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
            this.showModal = false;

            // バリデーションチェック
            this.validator();
            if (this.errors.length > 0) {
                this.showError();
                return;
            }

            this.result = this.createResult();

            // クリップボードにコピー
            if (navigator.clipboard) {
                navigator.clipboard.writeText(this.result);
                this.message = '下記のコードをクリップボードにコピーしました<br>VSCodeにペーストして下さい';
            } else {
                this.message = '下記のコードをコピーしてVSCodeにペーストして下さい';
            }
            this.showModal = true;
        },

        createResult: function() {
            let result = this.isOnlyBody() ? this.createBodyOnly() : this.createAll();
            const escapeResult = this.escapeDollarMark(result);
            return escapeResult;
        },

        createAll: function() {
            const name = this.name;
            const obj = {};
            obj.prefix = this.prefix;
            obj.description = this.description;
            obj.body = this.trimIndent(this.body);
            return `"${name}": ${JSON.stringify(obj, null, '\t')},`;
        },

        escapeDollarMark: function(text) {
            // $ のエスケープ 処理
            const dollarMark = new RegExp('\\$', 'g');
            dollarMarkReplacer.keep(text);
            dollarMarkReplacer.replace(dollarMark, '\\\\$');
            return dollarMarkReplacer.reverse();
        },

        createBodyOnly: function() {
            return`"body": ${JSON.stringify(this.trimIndent(this.body), null, '\t')},`;
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

        isOnlyBody: function() {
            const isEmptyName = Boolean(!this.name);
            const isEmptyPrefix = Boolean(!this.prefix);
            const isEmptyDescription = Boolean(!this.description);
            const isEmptyBody = Boolean(!this.body);
            if(
                isEmptyName === true &&
                isEmptyPrefix === true &&
                isEmptyDescription === true &&
                isEmptyBody === false
            ) {
                return true;
            }
            return false;
        },

        validator: function () {
            this.initError();

            // ボディのみ入力されている場合許容する
            if(this.isOnlyBody()) return;

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
            if (this.name.length > 40) {
                this.errors.push(new InputError('nameError', '40文字以下で入力してください'));
            }
            // prefixの文字数チェック 40文字以下
            if (this.prefix.length > 40) {
                this.errors.push(new InputError('prefixError', '40文字以下で入力してください'));
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

        hide: function () {
            this.showModal = false;
        }
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