
var jsdom = require('jsdom');

var MDPlus = require('../lib/md_plus.js');

exports.MDPlus = {
    Parser: {
        parse: {
            should_terminate: function (test) {
                var html = '<div></div>';
                var testCase = function (errors, window) {
                    var root = window.document.children[0];
                    var div = root.getElementsByTagName('div')[0];
                    var set = new MDPlus.Definition.Set([]);
                    var parser = new MDPlus.Parser(div, set)
                    
                    parser.parse();
                    test.done();
                };
                jsdom.env(html, [], testCase);
            },

            should_pass_span_to_definition: function (test) {
                var html = '<div><h1>matching</h1></div>';
                var testCase = function (errors, window) {
                    var root = window.document.children[0];
                    var div = root.getElementsByTagName('div')[0];
                    var callCount = 0;
                    var handler = function (span) {
                        callCount += 1;
                    };
                    var set = new MDPlus.Definition.Set([
                        new MDPlus.Definition({
                            tag: 'h1', content: 'matching',
                            handler: handler
                        })
                    ]);
                    set.bakeLocations();

                    var parser = new MDPlus.Parser(div, set)
                    
                    parser.parse();
                    test.equal(callCount, 1, "calls the handler")
                    
                    test.done();
                };
                jsdom.env(html, [], testCase);
            },

            should_not_match_elements_nested_in_other_trees: function (test) {
                var html = '<div><h1>matching</h1><h2>subheader</h2></div>';
                var testCase = function (errors, window) {
                    var root = window.document.children[0];
                    var div = root.getElementsByTagName('div')[0];
                    var matchingHandler = function () {
                        matchingHandler.callCount = (this.callCount || 0) + 1;
                    }
                    var subHandler = function () {
                        subHandler.callCount = (this.callCount || 0) + 1;
                    };
                    var set = new MDPlus.Definition.Set([
                        new MDPlus.Definition({
                            tag: 'h1', content: 'matching',
                            handler: matchingHandler
                        }),
                        new MDPlus.Definition({
                            tag: 'div', content: 'other',
                            handler: function () {},
                            children: [
                                new MDPlus.Definition({
                                    tag: 'h2', content: "subheader",
                                    handler: subHandler
                                })
                            ]
                        })
                    ]);
                    set.bakeLocations();
                    
                    var parser = new MDPlus.Parser(div, set)
                    
                    parser.parse();
                    test.equal(matchingHandler.callCount, 1, "does match the top-level h1")
                    test.equal(subHandler.callCount, undefined, "does not match the nested subheader")
                    test.done();
                }
                jsdom.env(html, [], testCase);
            }
        }
    }
}