/**
 * Consumes markdown like this:
 *   
 *   ## Instructor Interface
 *   * As an instructor I can log in
 *   * As an instructor I can log out
 */
window.StoriesGenerator = function () {
    var MDPlus = require('md-plus');

    var Story = function (name, tag, data) {
        this._name = name;
        this._tag = tag;
        this._data = data;
    };

    this.initialize = function (container) {
        this._container = container;
        this._stack = new MDPlus.StackBuilder();
        this._stack.setSequence(MDPlus.StackBuilder.HEADERS);

        var builder = new MDPlus.Definition.Builder();
        this._definition = builder.build([{
            tag: /^h[0-9]$/i,
            context: this._stack,
            handler: this._stack.handler,
            children: [{
                tag: 'li',
                context: this,
                handler: this.addStory
            }]
        }]);
    };

    this.addStory = function (span, definition) {
        var storyName = span.getMatchingElement().textContent;
        var tag = this._stack.getStack().join("_");
        var data = span.dataWithin();
        this._stories.push(new Story(storyName, tag, data));
    };

    this.consume = function () {
        var parser = new MDPlus.Parser(this._container, this._definition);
        this._stories = [];
        parser.parse();
    }    

    this.initialize.apply(this, arguments);
};