/**
 * A class to maintain a history of objects which implies a hierarchy.
 */
var StackBuilder = function () {
    this.initialize = function () {
        this._stack = [];
    };
    
    this.setSequence = function (sequence) {
        this._sequence = sequence;
    };

    this.handle = function (set, refPath) {
        var definition = set.getDefinition(refPath);
        definition.setHandler(this.handler, this);
    };

    this.setContentHandler = function (contentHandler) {
        this._contentHandler = contentHandler;
    };

    this.getStack = function () {
        return this._stack;
    };

    this._getDepth = function (span, definition) {
        var tagName;
        var depth = 0;
        if (this._sequence.apply) {
            depth = this._sequence(span, definition);
        } else if (this._sequence.indexOf) {
            tagName = span.getMatchingElement().tagName;
            depth = this._sequence.indexOf(tagName);
        }
        return depth;
    };
    
    this._popStackToDepth = function (depth) {
        var index, stackLength = this._stack.length;
        for (index = stackLength; index > depth; index--) {
            this._stack.pop();
        }
    };

    this._getContents = function (span, definition) {
        var content;
        if (this._contentHandler) {
            content = this._contentHandler(span, definition);
        } else {
            content = span.getMatchingElement().textContent;
        }
        return content;
    };

    this.handler = function (span, definition) {
        var depth = this._getDepth(span, definition);
        var content = this._getContents(span, definition);

        this._popStackToDepth(depth);
        this._stack.push(content);
    };

    this.initialize.apply(this, arguments);
}
StackBuilder.HEADERS = ["H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8", "H9"];

exports.StackBuilder = StackBuilder;