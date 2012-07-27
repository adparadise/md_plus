
var Info = require('../validation/info.js').Info;

exports.validate = function (set) {
    var index, error;
    var errors = new Info();
    if (!set._definitions) {
        errors.push({
            field: 'definitions',
            message: "No definitions provided"
        });
        return errors;
    }

    if (typeof set._definitions.length !== "number") {
        errors.push({
            field: 'definitions',
            message: "Definitions not an array"
        });
        return errors;
    }
        
    for (index = set._definitions.length; index--;) {
        if (!set._definitions[index].validate) {
            errors.push({
                field: 'definitions',
                message: 'Child: ' + index + ' not a definition: didn\'t respond to validate'
            });
        } else {
            error = set._definitions[index].validate();
            if (error.anyErrors()) {
                errors.push({
                    field: 'definitions',
                    message: 'Child: ' + index + ' is invalid'
                });
            }
        }
    }
    return errors;
}

