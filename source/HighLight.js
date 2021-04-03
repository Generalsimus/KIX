const highlight = require('highlight-es');
const chalk = require('chalk');


// const code = ` 
//   var s = <div  ssss ="sds">sdsds{ss}</div>
    
// `;

var LAST_KEY,
    LAST_VALUE;



var HIGLITHER = {
    string: str => {
        LAST_KEY = "string"
        LAST_VALUE = str
        return chalk.rgb(206, 145, 120)(str)
    },
    punctuator: str => {
        if (LAST_KEY == "punctuator" && LAST_VALUE == "<" && str == "/") {
            LAST_KEY = "CLOSE_TAG"
            LAST_VALUE = "</"
        } else {


            LAST_KEY = "punctuator"
            LAST_VALUE = str
        }

        return chalk.rgb(103, 205, 204)(str)
    },
    name: str => {
        // console.log(LAST_KEY, LAST_VALUE)
        if (LAST_KEY == "punctuator" && LAST_VALUE == "<") {
            // OPENED_JSX = true
            LAST_KEY = "OPEN_TAG"
            LAST_VALUE = str
            return chalk.rgb(3, 141, 255)(str)
        } else if (LAST_KEY == "CLOSE_TAG" && LAST_VALUE == "</") {

            LAST_KEY = "CLOSE_TAG_NAME"
            LAST_VALUE = str
            return chalk.rgb(3, 141, 255)(str)
        }

        LAST_KEY = "punctuator"
        LAST_VALUE = str
        return chalk.rgb(204, 204, 204)(str)
    },
    keyword: str => {


        LAST_KEY = "keyword"
        LAST_VALUE = str
        return chalk.rgb(255, 121, 198)(str)
    },
    number: str => {
        LAST_KEY = "number"
        LAST_VALUE = str
        return chalk.rgb(181, 206, 168)(str)
    },
    regex: str => {
        LAST_KEY = "regex"
        LAST_VALUE = str
        return chalk.rgb(206, 145, 120)(str)
    },
    comment: str => {
        LAST_KEY = "comment"
        LAST_VALUE = str
        return chalk.rgb(153, 153, 153)(str)
    },
    invalid: str => {
        LAST_KEY = "invalid"
        LAST_VALUE = str
        return chalk.rgb(223, 51, 51)(str)
    }
}
module.exports = function (code) {
    return highlight(code, HIGLITHER)
}