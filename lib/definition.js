
/**
   
 */
var Definition = function () {
    this.initialize = function (description) {
        this._description = description;
    };

    this.validate = function (description) {
        var errors = new Definition.ValidationInfo();
        var index, child, childErrors;

        if (!this._description.tag) {
            errors.push({
                level: 'error',
                field: 'tag',
                message: 'Missing tag declaration'
            });
        }
        if (!this._description.classRef) {
            errors.push({
                level: 'error',
                field: 'classRef',
                message: 'Missing classRef declaration'
            });
        }
        if (this._description.children) {
            if (typeof this._description.children.length !== "number") {
                errors.push({
                    level: 'error',
                    field: 'children',
                    message: 'Children should be an array: no length propery found'
                });
            }
            for (index = this._description.children.length; index--;) {
                child = this._description.children[0];
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

    this.match = function (element) {
        return element.tagName === this._getTagName();
    };

    this._getTagName = function () {
        return this._description.tag.toUpperCase();
    };

    this.initialize.apply(this, arguments);
};
Definition.ValidationInfo = require('./definition/validation_info.js').ValidationInfo;

exports.Definition = Definition;