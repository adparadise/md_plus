
/**
   
 */
var Definition = function () {
    this.initialize = function (description) {
        this._description = description;
    };

    this.validate = function (description) {
        var errors = new Definition.ValidationInfo();

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