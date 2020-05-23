const testMixin = {
    method: {
        test() {
            this.test1();
            this.test2();
            this.test3();
        },

        test1() {
            // タブインデントテスト
            const testResult = 
`"Test1": {
	"prefix": "test",
	"description": "説明1",
	"body": [
		"<div class=\\"test\\">",
		"\\t<p>test1</p>",
		"</div>"
	]
},`;
            this.name = 'Test1';
            this.prefix = 'test';
            this.description = '説明1';
            this.body =
`<div class="test">
\t<p>test1</p>
</div>`;
            this.selected = this.options[2].value;
            this.generateSnippet();
            if(this.result.toString() != testResult.toString()) {
                console.log("NG1");
                console.log("Result:" + this.result.toString());
                console.log("予測:" + testResult.toString());
            } else {
                console.log("OK1");
            }
        },
        test2() {
            // スペース2インデントテスト
            const testResult = 
`"Test2": {
	"prefix": "test2",
	"description": "説明2",
	"body": [
		"<div class=\\"test\\">",
		"\\t\\t<p>test2</p>",
		"\\t</div>"
	]
},`;
            this.name = 'Test2';
            this.prefix = 'test2';
            this.description = '説明2';
            this.body =
`  <div class="test">
      <p>test2</p>
    </div>`;
            this.selected = this.options[0].value;
            this.generateSnippet();
            if(this.result.toString() != testResult.toString()) {
                console.log("NG2");
                console.log("Result:" + this.result.toString());
                console.log("予測:" + testResult.toString());
            } else {
                console.log("OK2");
            }
        },
        test3() {
            // スペース4インデントテスト
            const testResult = 
`"Test3": {
	"prefix": "test",
	"description": "説明3",
	"body": [
		"<div class=\\"test\\">",
		"\\t<p>test3</p>",
		"</div>"
	]
},`;
            this.name = 'Test3';
            this.prefix = 'test';
            this.description = '説明3';
            this.body =
`      <div class="test">
          <p>test3</p>
      </div>`;
            this.selected = this.options[1].value;
            this.generateSnippet();
            if(this.result.toString() != testResult.toString()) {
                console.log("NG3");
                console.log("Result:" + this.result.toString());
                console.log("予測:" + testResult.toString());
            } else {
                console.log("OK3");
            }
        },
        test4() {
            // タブインデントテスト
            const testResult = 
`"Test1": {
	"prefix": "test",
	"description": "説明1",
	"body": [
		"<div class=\\"test\\">",
		"\\t<p>test1</p>",
		"</div>"
	]
},`;
            this.name = 'Test1';
            this.prefix = 'test';
            this.description = '説明1';
            this.body =
`<div class="test">
\t<p>test1</p>
</div>`;
            this.selected = this.options[2].value;
            this.generateSnippet();
            if(this.result.toString() != testResult.toString()) {
                console.log("NG1");
                console.log("Result:" + this.result.toString());
                console.log("予測:" + testResult.toString());
            } else {
                console.log("OK1");
            }
        },
        test5() {
            // タブインデントテスト
            const testResult = 
`"Test1": {
	"prefix": "test",
	"description": "説明1",
	"body": [
		"<div class=\\"test\\">",
		"\\t<p>test1</p>",
		"</div>"
	]
},`;
            this.name = 'Test1';
            this.prefix = 'test';
            this.description = '説明1';
            this.body =
`<div class="test">
\t<p>test1</p>
</div>`;
            this.selected = this.options[2].value;
            this.generateSnippet();
            if(this.result.toString() != testResult.toString()) {
                console.log("NG1");
                console.log("Result:" + this.result.toString());
                console.log("予測:" + testResult.toString());
            } else {
                console.log("OK1");
            }
        },
    }
}

