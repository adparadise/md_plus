var Validation = require('./validation.js');

/**
 * A container class to represent a translation from HTML entities to class instances.
 */
var Definition = function () {
    this.initialize = function (description) {
        this._description = description;
    };

    this.validate = function () {
        if (!this._validationInfo) {
            this._validationInfo = Validation.validate(this);
        }
        return this._validationInfo;
    };

    this.set = function(key, value) {
        this._description[key] = value;
    };

    this.setHandler = function (handler, context) {
        this.set('handler', handler);
        this.set('context', context);
    };

    this.get = function(key) {
        return this._description[key];
    };

    this.isValid = function () {
        return !this.validate().anyErrors();
    };

    this.getID = function () {
        return this._id;
    };

    this.getDepth = function () {
        return this._id.length
    };

    this.bakeIDs = function (id) {
        var offset, definitionCount = this.getDefinitionCount();
        var definition, subID;
        this._id = id;
        for (offset = 0; offset < definitionCount; offset++) {
            definition = this.getChildAt(offset);
            subID = id.slice(0);
            subID.push(offset);
            definition.bakeIDs(subID);
        }
        this.bakeTags();
    };

    this.bakeTags = function () {
        var tagsList;
        var index, tagListLength;
        var tagsRegexp;

        // Determine how tags were defined by the user
        if (typeof this._description.tag === "string") {
            tagsList = this._description.tag.split("|");
        } else if (this._description.tag.test) {
            tagsRegexp = this._description.tag;
        } else if (typeof this._description.tag === "object") {
            tagsList = this._description.tag;
        }

        // Assign the appropriate 'private' description.
        if (tagsList) {
            tagsListLength = tagsList.length;
            this._description._tags = [];
            for (index = 0; index < tagsListLength; index++) {
                this._description._tags.push(tagsList[index].toUpperCase());
            }
        } else {
            this._description._tagsRegexp = tagsRegexp;
        }
    };

    this.eachDefinition = function (callback) {
        var offset, childrenLength = this.getDefinitionCount();
        var childDefinition;

        callback(this);
        for (offset = 0; offset < childrenLength; offset++) {
            childDefinition = this.getChildAt(offset);
            childDefinition.eachDefinition(callback);
        }
    };

    this.consume = function (span) {
        if (!this.isValid()) {
            this.failValidation();
            return;
        }
        if (this._description.context) {
            this._description.handler.apply(this._description.context, [span, this]);
        } else {
            this._description.handler(span, this);
        }
    };

    this.failValidation = function () {
        var messageFragments = ["Invalid Definition"];
        var validation = this.validate();
        var index, info;
        for (index = validation.errorCount(); index--;) {
            messageFragments.push(validation.errorAtToString(index));
        }
        throw new Error(messageFragments.join("\n       "));
    };

    this.match = function (element) {
        if (!this.isValid()) {
            this.failValidation();
            return;
        }
        if (!this._tagMatches(element)) {
            return false;
        }
        
        if (!this._contentMatches(element)) {
            return false;
        }

        return true;
    };

    this._tagMatches = function (element) {
        var index, tagsLength;
        var tagName = element.tagName;

        if (this._description._tags) {
            tagsLength = this._description._tags.length;
            for (index = 0; index < tagsLength; index++) {
                if (tagName === this._description._tags[index]) {
                    return true;
                }
            }
        } else if (this._description._tagsRegexp) {
            return this._description._tagsRegexp.test(tagName);
        }
        return false;
    };

    this.getChildAt = function (offset) {
        if (!this._description || !this._description.children) {
            return;
        }
        return this._description.children[offset];
    };

    this.getDefinitionCount = function () {
        if (!this._description.children) {
            return 0;
        }
        return this._description.children.length;
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

    this.getTagName = function () {
        return this._description.tag.toUpperCase();
    };

    this.getContentPattern = function () {
        return this._description.content;
    };

    this.initialize.apply(this, arguments);
};

exports.Definition = Definition;