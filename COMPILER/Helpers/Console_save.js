var SAVE_LOG = [],
    COLORS = {
        white: "\x1b[37m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        red: "\x1b[31m",
        blue: "\x1b[34m"
    };

console.save = function () {
    // return
    console.clear();

    var i = 0;
    while (arguments[i]) {
        var str = arguments[i],
            color = arguments[i + 1] || 'white';

        SAVE_LOG.push(`${COLORS[color] + str}\x1b[0m`)
        i = i + 2;
    }

    console.log.apply(null, SAVE_LOG)

}