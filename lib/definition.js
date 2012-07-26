
/**
   
 */
var Definition = function () {
    this.initialize = function (description) {
        this._description = description;
    };

    this.validate = function () {
        var errors = new Definition.ValidationInfo();

        if (!this._description.tag) {
            errors.push({
                level: 'error',
                field: 'tag',
                message: 'Missing tag declaration'
            });
        }

        return errors;
    };

    this.initialize.apply(this, arguments);
};
Definition.ValidationInfo = require('./definition/validation_info.js').ValidationInfo;

exports.Definition = Definition;