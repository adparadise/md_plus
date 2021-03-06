
var jsdom = require('jsdom');

var MDPlus = require('../md_plus.js');

exports.MDPlus = {
    Parser: {
        parse: {
            should_terminate: function (test) {
                var html = '<div></div>';
                var set = new MDPlus.Definition.Set([]);
                var testCase = function (errors, window) {
                    var root = window.document.children[0];
                    var div = root.getElementsByTagName('div')[0];
                    var parser = new MDPlus.Parser(div, set)
                    
                    parser.parse();
                    test.done();
                };
                jsdom.env(html, [], testCase);
            },

            should_pass_span_to_definition: function (test) {
                var html = '<div><h1>matching</h1></div>';
                var callCount = 0;
                var handler = function (span) {
                    callCount += 1;
                };
                var set = new MDPlus.Definition.Set([
                    new MDPlus.Definition.Definition({
                        tag: 'h1', content: 'matching',
                        handler: handler
                    })
                ]);
                set.bakeIDs();

                var testCase = function (errors, window) {
                    var root = window.document.children[0];
                    var div = root.getElementsByTagName('div')[0];

                    var parser = new MDPlus.Parser(div, set)
                    
                    parser.parse();
                    test.equal(callCount, 1, "calls the handler")
                    
                    test.done();
                };
                jsdom.env(html, [], testCase);
            },

            should_set_span_correctly_covering_remainder: function (test) {
                var html = [
                    '<div>', 
                    '<h1>Project Title</h1>', 
                    '<h2>Stories</h2><p>Description of stories</p>', 
                    '<h2>Deliverables</h2><p>Description of deliverables</p>', 
                    '</div>'].join("");
                var foundSpanLow, foundSpanHigh;
                var handler = function (span) {
                    foundSpanLow = span.getLow();
                    foundSpanHigh = span.getHigh();
                };
                var set = new MDPlus.Definition.Set([
                    new MDPlus.Definition.Definition({
                        tag: 'h1',
                        handler: handler
                    })
                ]);
                set.bakeIDs();

                var testCase = function (errors, window) {
                    var root = window.document.children[0];
                    var div = root.getElementsByTagName('div')[0];

                    var parser = new MDPlus.Parser(div, set)
                    
                    parser.parse();
                    test.deepEqual(foundSpanLow, [0], "sets the low bound correctly")
                    test.deepEqual(foundSpanHigh, [], "sets the high bound correctly")
                    
                    test.done();
                };
                jsdom.env(html, [], testCase);
            },

            should_set_span_correctly_up_to_next_match: function (test) {
                var html = [
                    '<div>', 
                    '<h1>Project Title</h1>', 
                    '<h2>Stories</h2><p>Description of stories</p>', 
                    '<h2>Deliverables</h2><p>Description of deliverables</p>', 
                    '</div>'].join("");
                var callCount = 0;
                var foundSpanLow, foundSpanHigh
                var handler = function (span) {
                    callCount += 1;
                    foundSpanLow = span.getLow();
                    foundSpanHigh = span.getHigh();
                };
                var set = new MDPlus.Definition.Set([
                    new MDPlus.Definition.Definition({
                        tag: 'h1', handler: handler,
                        children: [
                            new MDPlus.Definition.Definition({ tag: 'h2', handler: function () {} })
                        ]
                    })
                ]);
                set.bakeIDs();
                var testCase = function (errors, window) {
                    var root = window.document.children[0];
                    var div = root.getElementsByTagName('div')[0];

                    var parser = new MDPlus.Parser(div, set)
                    
                    parser.parse();
                    test.equal(callCount, 1, "should call the h1 handler once");
                    test.deepEqual(foundSpanLow, [0], "sets the low bound correctly")
                    test.deepEqual(foundSpanHigh, [1], "sets the high bound correctly")
                    
                    test.done();
                };
                jsdom.env(html, [], testCase);
            },

            should_parse_more_complex_trees: function (test) {
                var html = [
                    '<div>', 
                    '<h1>Project Title</h1>', 
                    '<h2>Stories</h2><p>Description of stories</p>', 
                    '<h3>Deliverables</h3><p>Description of deliverables</p>', 
                    '<h2>Other</h2><p>Description of other</p>', 
                    '</div>'].join("");
                var callCount = 0;
                var foundSpanLow, foundSpanHigh
                var handler = function (span) {
                    callCount += 1;
                    foundSpanLow = span.getLow();
                    foundSpanHigh = span.getHigh();
                };
                var set = new MDPlus.Definition.Set([
                    new MDPlus.Definition.Definition({
                        tag: 'h1', handler: function () {},
                        children: [
                            new MDPlus.Definition.Definition({
                                tag: 'h2', handler: handler,
                                children: [
                                    new MDPlus.Definition.Definition({
                                        tag: 'h3', handler: function () {}
                                    })
                                ]
                            })
                        ]
                    })
                ]);
                set.bakeIDs();

                var testCase = function (errors, window) {
                    var root = window.document.children[0];
                    var div = root.getElementsByTagName('div')[0];
                    var parser = new MDPlus.Parser(div, set)
                    
                    parser.parse();
                    test.equal(callCount, 2, "should call the h2 handler twice");
                    test.deepEqual(foundSpanLow, [5], "sets the low bound correctly")
                    test.deepEqual(foundSpanHigh, [], "sets the high bound correctly")
                    
                    test.done();
                };
                jsdom.env(html, [], testCase);
            },

            should_not_match_elements_nested_in_other_trees: function (test) {
                var html = '<div><h1>matching</h1><h2>subheader</h2></div>';
                var matchingHandler = function () {
                    matchingHandler.callCount = (this.callCount || 0) + 1;
                }
                var subHandler = function () {
                    subHandler.callCount = (this.callCount || 0) + 1;
                };
                var set = new MDPlus.Definition.Set([
                    new MDPlus.Definition.Definition({
                        tag: 'h1', content: 'matching',
                        handler: matchingHandler
                    }),
                    new MDPlus.Definition.Definition({
                        tag: 'div', content: 'other',
                        handler: function () {},
                        children: [
                            new MDPlus.Definition.Definition({
                                tag: 'h2', content: "subheader",
                                handler: subHandler
                            })
                        ]
                    })
                ]);
                set.bakeIDs();

                var testCase = function (errors, window) {
                    var root = window.document.children[0];
                    var div = root.getElementsByTagName('div')[0];
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