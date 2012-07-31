var Info = require('./validation/info.js').Info;

exports.validate = function (definition) {
    var errors = new Info();
    var index, child, childErrors;

    if (!definition._description) {
        errors.push({
            message: 'No description provided'
        });
        return errors;
    }

    if (!definition._description.tag) {
        errors.push({
            field: 'tag',
            message: 'Missing tag declaration'
        });
    }
    if (!definition._description.handler) {
        errors.push({
            field: 'handler',
            message: 'Missing classRef declaration'
        });
    }
    if (definition._description.children) {
        if (typeof definition._description.children.length !== "number") {
            errors.push({
                field: 'children',
                message: 'Children should be an array: no length property found'
            });
        }
        for (index = definition._description.children.length; index--;) {
            child = definition._description.children[0];
            if (!child.validate) {
                errors.push({
                    field: 'children',
                    message: 'Child: ' + index + ' not a definition: didn\'t respond to validate'
                });
                continue;
            }
            childErrors = child.validate();
            if (childErrors.anyErrors()) {
                errors.push({
                    field: 'children',
                    message: 'Child: ' + index + ' is invalid',
                    isBubbledUp: true
                });
            }
        }
    }
    
    return errors;
};
