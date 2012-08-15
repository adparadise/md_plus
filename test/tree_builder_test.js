
var jsdom = require('jsdom');

var MDPlus = require('../md_plus.js');

exports.MDPlus = {
    TreeBuilder:  {
        bakeDefinitions: {
            should_create_handlers: function (test) {
                var set = new MDPlus.Definition.Set([
                    new MDPlus.Definition.Definition({
                        tag: 'h1'
                    })
                ]);
                var treeBuilder = new MDPlus.TreeBuilder({}, set);
                treeBuilder.bakeDefinitions();

                test.ok(set.getChildAt(0).get('handler'), "should create a handler");
                test.done();
            }
        },

        parse: {
            should_interact_with_parser: function (test) {
                var html = ['<div><h1>Project Title</h1>',
                            '<h2>Stories</h2><p>stories description</p>',
                            '</div>'].join();
                
                var set = new MDPlus.Definition.Set([
                    new MDPlus.Definition.Definition({
                        tag: 'h1',
                        children: [
                            new MDPlus.Definition.Definition({
                                tag: 'h2'
                            })
                        ]
                    })
                ]);
                var classRef = function () {
                    this._children = [];
                    this.build = function (span, definition) {
                        this.label = span.getMatchingElement().textContent;
                    };
                    this.push = function (child) {
                        this._children.push(child);
                    }
                };
                var treeBuilder = new MDPlus.TreeBuilder({classRef: classRef}, set);
                treeBuilder.bakeDefinitions();
                
                var testCase = function (errors, window) {
                    var root = window.document.children[0];
                    var div = root.getElementsByTagName('div')[0];
                    var parser = new MDPlus.Parser(div, set)
                    var tree;
                    
                    parser.parse();
                    tree = treeBuilder.getObjects()[0];
                    test.equal(tree.label, 'Project Title', "built the label from textContent");
                    test.equal(tree._children[0].label, 'Stories', "assign the child correctly");
                    test.done();
                }
                jsdom.env(html, [], testCase);
            }
        }
    }
}