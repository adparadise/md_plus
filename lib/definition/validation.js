
var Info = require('./validation/info.js').Info;

exports.validate = function (definition) {
    var errors = new Info();
        var index, child, childErrors;

        if (!definition._description) {
            errors.push({
                level: 'error',
                message: 'No description provided'
            });
            return errors;
        }

        if (!definition._description.tag) {
            errors.push({
                level: 'error',
                field: 'tag',
                message: 'Missing tag declaration'
            });
        }
        if (!definition._description.classRef) {
            errors.push({
                level: 'error',
                field: 'classRef',
                message: 'Missing classRef declaration'
            });
        }
        if (definition._description.children) {
            if (typeof definition._description.children.length !== "number") {
                errors.push({
                    level: 'error',
                    field: 'children',
                    message: 'Children should be an array: no length propery found'
                });
            }
            for (index = definition._description.children.length; index--;) {
                child = definition._description.children[0];
                if (!child.validate) {
                    errors.push({
                        level: 'error',
                        field: 'children',
                        message: 'Child: ' + index + ' not a definition: didn\'t respond to validate'
                    });
                    continue;
                }
                childErrors = child.validate();
                if (childErrors.anyErrors()) {
                    errors.push({
                        level: 'error',
                        field: 'children',
                        message: 'Child: ' + index + ' is invalid'
                });
            }
        }
    }

    return errors;
};
