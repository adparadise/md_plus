/**
 * Consumes markdown like this:
 *   
 *   ## Instructor Interface
 *   * As an instructor I can log in
 *   * As an instructor I can log out
 */
window.StoriesGenerator = function () {
    var MDPlus = require('md-plus');

    var Story = function (name, tag) {
        this._name = name;
        this._tag = tag;
    };

    // Alternate sequence definition for StackBuilder:
    // Return depth by returning the header type minus one.
    var sequence = function (span, definition) {
        var tagName = span.getMatchingElement().tagName;
        var pattern = /^h([0-9])$/i;
        var match = pattern.exec(tagName);
        if (match) {
            return parseInt(match[1]) - 1;
        }
        return 0;
    };
    
    this.initialize = function (container) {
        this._container = container;
        this._stack = new MDPlus.StackBuilder();
        this._stack.setSequence(MDPlus.StackBuilder.HEADERS);

        this._definition = new MDPlus.Definition.Set([
            new MDPlus.Definition({
                tag: /^h[0-9]$/i,
                context: this._stack,
                handler: this._stack.handler,
                children: [
                    new MDPlus.Definition({
                        tag: 'li',
                        context: this,
                        handler: this.addStory
                    })
                ]
            })
        ]);
        this._definition.bakeIDs();
    };

    this.addStory = function (span, definition) {
        var storyName = span.getMatchingElement().textContent;
        var tag = this._stack.getStack().join("_");
        this._stories.push(new Story(storyName, tag));
    };

    this.consume = function () {
        var parser = new MDPlus.Parser(this._container, this._definition);
        this._stories = [];
        parser.parse();
        
        console.log(this._stories);
    }    

    this.initialize.apply(this, arguments);
};