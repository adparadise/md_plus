var TOCGenerator = function () {
    var MDPlus = require('md-plus');

    var Node = function () {
        this._children = [];

        this.build = function (span, definition) {
            this._headerElement = span.getMatchingElement();
            this.label = this._headerElement.textContent;
            this.anchorName = this.label.toLowerCase().replace(/([^a-z0-9]+)/g, "_");
        };

        this.push = function (child) {
            child.parent = this;
            this._children.push(child);
        };
    };

    this.initialize = function (container) {
        this._container = container;
        this._definition = new MDPlus.Definition.Set([
            new MDPlus.Definition({
                tag: 'h1',
                children: [
                    new MDPlus.Definition({
                        tag: 'h2',
                        children: [
                            new MDPlus.Definition({
                                tag: 'h3'
                            })
                        ]
                    })
                ]
            })
        ]);
        this._treeBuilder = new MDPlus.TreeBuilder({classRef: Node}, this._definition);
        this._treeBuilder.bakeDefinitions();
    };

    this.consume = function () {
        var parser = new MDPlus.Parser(this._container, this._definition);
        parser.parse();
        this.toc = this._treeBuilder.getObjects()[0];

        this.createTOC();
        this.buildAnchors();
    };

    this.createTOC = function () {
        var domElement = document.createElement("DIV");
        domElement.innerHTML = this.renderTOC();
        this._container.insertBefore(domElement, this.toc._headerElement);
    };

    this.printTree = function (object, prefix) {
        var index, childrenLength = object._children.length;
        prefix = prefix || "";
        console.log(prefix + object.label);
        prefix = prefix + "  ";
        for (index = 0; index < childrenLength; index++) {
            this.printTree(object._children[index], prefix);
        }
    };

    this.buildAnchors = function (object) {
        var index, childrenLength;
        if (!object) {
            object = this.toc;
        }

        var anchorHTML = '<a name="' + object.anchorName + '">' + object._headerElement.innerHTML + '</a>';
        object._headerElement.innerHTML = anchorHTML;

        childrenLength = object._children.length;
        for (index = 0; index < childrenLength; index++) {
            this.buildAnchors(object._children[index]);
        }
    };

    this.renderTOC = function (object, contents) {
        var index, childrenLength;
        var isOuterCall = false;
        if (!object) {
            isOuterCall = true;
            object = this.toc;
        }
        if (!contents) {
            contents = [];
        }
        contents.push('<a href="#' + object.anchorName + '">' + object.label + '</a>');
        childrenLength = object._children.length;
        for (index = 0; index < childrenLength; index++) {
            this.renderTOC(object._children[index], contents);
        }
        if (isOuterCall) {
            return contents.join("<br/>");
        }
    };

    this.initialize.apply(this, arguments);
}