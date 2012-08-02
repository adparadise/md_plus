
var jsdom = require('jsdom');

var MDPlus = require('../md_plus.js');

exports.MDPlus = {
    TreeBuilder:  {
        bakeDefinitions: {
            should_create_handlers: function (test) {
                var set = new MDPlus.Definition.Set([
                    new MDPlus.Definition({
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
            should: function (test) {
                var html = '<div><h1>Project Title</h1></div>';
                
                var set = new MDPlus.Definition.Set([
                    new MDPlus.Definition({
                        tag: 'h1'
                    })
                ]);
                var treeBuilder = new MDPlus.TreeBuilder({}, set);
                treeBuilder.bakeDefinitions();
                
                var testCase = function (errors, window) {
                    var root = window.document.children[0];
                    var div = root.getElementsByTagName('div')[0];
                    var parser = new MDPlus.Parser(div, set)
                    var tree;
                    
                    parser.parse();
                    tree = treeBuilder.getObjects()[0];
                    test.equal(tree.label, 'Project Title', "built the label from textContent");
                    test.done();
                }
                jsdom.env(html, [], testCase);
            }
        }
    }
}