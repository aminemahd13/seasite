'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.log = undefined;
exports.createFormatter = createFormatter;
exports.createConsoleHandler = createConsoleHandler;
exports.createNodeConsoleHandler = createNodeConsoleHandler;
exports.addHandler = addHandler;
exports.setLogHandler = setLogHandler;

var _colorize = require('./colorize');

var log = require('./logger-core'); // (C)opyright by Dirk Holtwick, 2018 <https://holtwick.de/copyright>

// https://github.com/jonnyreeves/js-logger

log.useDefaults();

var LOG_PATH = 'seasite.log';

try {
    LOG_PATH = process.env.LOG_PATH || LOG_PATH;
} catch (err) {}

function translateLogLevel(level) {
    switch (level.toLowerCase()) {
        case 'error':
            return {
                prefix: 'E|*** ',
                color: 'red'
            };
        case 'warn':
            return {
                prefix: 'W|**  ',
                color: 'magenta'
            };
        case 'info':
            return {
                prefix: 'I|*   ',
                color: 'cyan'
            };
        case 'debug':
            return {
                prefix: 'D|    ',
                color: 'yellow'
                // case 'time' :
                //     return {
                //         prefix: 'T|    ',
                //         color: 'magenta',
                //     }
            };default:
            break;
    }
    return {
        prefix: 'V|    ',
        color: null
    };
}

var colors = (0, _colorize.checkAnsiColorsAvailable)();

function prettyFormatMessages(messages) {
    for (var i = 0; i < messages.length; i++) {
        var d = messages[i];
        if (!d) continue;
        if (typeof d === 'string') {
            messages[i] = d;
        } else {
            try {
                var j = JSON.stringify(d, null, 2);
                if (j.indexOf('\n') >= 0 || j.length > 60) {
                    messages[i] = '\n' + j + '\n';
                } else {
                    messages[i] = j;
                }
            } catch (err) {
                messages[i] = d.toString();
            }
        }
    }
}

function createFormatter() {
    var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        date: false,
        level: false,
        name: false,
        color: false,
        pretty: false
    };

    var alternation = true;
    return function (messages, context) {
        if (opt.name === true && context.name) {
            messages.unshift('[' + context.name + ']');
        }
        if (opt.level === true) {
            var level = translateLogLevel(context.level.name);
            messages.unshift(level.prefix);
        }
        if (opt.date === true) {
            messages.unshift(new Date().toISOString());
        }
        if (opt.color === true && colors) {
            var _level = translateLogLevel(context.level.name);
            var c = _level.color;
            if (c) {
                if (context.level.name.toLowerCase() === 'debug') {
                    alternation = !alternation;
                    c = alternation ? 'white' : c;
                }
                messages[0] = _colorize.ansicodes[c] + messages[0].toString();
                messages.push(_colorize.ansicodes.reset);
            }
        }
        if (opt.pretty === true) {
            prettyFormatMessages(messages);
        }
    };
}

function createConsoleHandler(opt) {
    return log.createDefaultHandler();
}

function createNodeConsoleHandler(opt) {
    return log.createDefaultHandler({
        formatter: createFormatter({
            name: true,
            level: false,
            color: true
        })
    });
}

var logHandler = [createConsoleHandler()];

if (colors) {
    logHandler = [createNodeConsoleHandler()];
}

function addHandler(handler) {
    logHandler.push(handler);
}

function setLogHandler(handler) {
    logHandler = handler;
}

log.setHandler(function (messages, context) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = logHandler[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var handler = _step.value;

            try {
                handler(messages, context);
            } catch (err) {
                //
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
});

try {
    process.on('unhandledRejection', function (reason, p) {
        log.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
    });
    // process.on('handledRejection', function (reason, p) {
    //     console.log('Possibly handled rejection at: Promise ', p, ' reason: ', reason)
    // })
    process.on('uncaughtException', function (err) {
        log.error('Caught exception', err);
    });
} catch (err) {}

var logger = log;
exports.log = log;