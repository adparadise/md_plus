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

    this.initialize = function (container) {
        this._container = container;
        this._definition = new MDPlus.Definition.Set([
            new MDPlus.Definition({
                tag: 'h2',
                context: this,
                handler: this.setTag,
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

    this.setTag = function (span, definition) {
        this._currentTag = span.getMatchingElement().textContent;
    };

    this.addStory = function (span, definition) {
        var storyName = span.getMatchingElement().textContent;
        this._stories.push(new Story(storyName, this._currentTag));
    };

    this.consume = function () {
        var parser = new MDPlus.Parser(this._container, this._definition);
        this._stories = [];
        parser.parse();
        
        console.log(this._stories);
    }    

    this.initialize.apply(this, arguments);
};