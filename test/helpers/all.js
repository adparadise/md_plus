

var include = function (moduleObject) {
    for (methodName in moduleObject) {
        if (!moduleObject.hasOwnProperty(methodName)) {
            continue;
        }
        exports[methodName] = moduleObject[methodName];
    }
};

include(require('./definition_helpers.js'));
