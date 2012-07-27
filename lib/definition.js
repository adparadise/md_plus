
/**
 * A container class to represent a translation from HTML entities to class instances.
 */
var Definition = function () {
    this.initialize = function (description) {
        this._description = description;
    };

    this.validate = function () {
        return Definition.Validation.validate(this);
    };

    this.match = function (element) {
        if (element.tagName !== this._getTagName()) {
            return false;
        }
        
        if (!this._contentMatches(element)) {
            return false;
        }

        return true;
    };

    this._contentMatches = function (element) {
        var textContent;
        var contentRegExp;

        if (!this._description.content) {
            return true;
        }

        textContent = element.textContent;
        if (this._description.content.test && this._description.content.test(textContent)) {
            return true;
        } else {
            contentRegExp = new RegExp(this._description.content);
            if (contentRegExp.test(textContent)) {
                return true;
            }
        }

        return false;
    };

    this._getTagName = function () {
        return this._description.tag.toUpperCase();
    };

    this.initialize.apply(this, arguments);
};
Definition.Validation = require('./definition/validation.js');
Definition.Set = require('./definition/set.js').Set;

exports.Definition = Definition;