var jsdom = require('jsdom');

var MDPlus = require('../md_plus.js');
var Helpers = require('./helpers/all.js');

exports.MDPlus = {
    Definition: {
        bakeLocations: {
            should_match_location: function (test) {
                var set = Helpers.definitionSet();
                var builder = new MDPlus.Definition.CandidatesBuilder(set);
                var definition;
                set.bakeLocations();

                
                definition = builder.getDefinitionAtLocation([0,0]);
                test.deepEqual(definition.getLocation(),     [0,0]);

                definition = builder.getDefinitionAtLocation([0,1]);
                test.deepEqual(definition.getLocation(),     [0,1]);

                definition = builder.getDefinitionAtLocation([1,0]);
                test.deepEqual(definition.getLocation(),     [1,0]);

                definition = builder.getDefinitionAtLocation([1,1]);
                test.deepEqual(definition.getLocation(),     [1,1]);

                test.done();
            }
        },

        match: {
            matches_tag: function (test) {
                var def = new MDPlus.Definition({
                    tag: 'H1',
                    handler: true
                });
                var html = '<h1>here</h1><h2>there</h2>'; 
                var testCase = function (errors, window) {
                    var root = window.document.children[0];
                    var h1 = root.getElementsByTagName('h1')[0];
                    var h2 = root.getElementsByTagName('h2')[0];
                    test.ok(def.match(h1), "should match correct tag");
                    test.ok(!def.match(h2), "should not match incorrect tag");
                    test.done();
                }
                jsdom.env(html, [], testCase);
            },

            matches_lowercase_tag_definition: function (test) {
                var def = new MDPlus.Definition({
                    tag: 'h1',
                    handler: true
                });
                var html = '<h1>here</h1>';
                var testCase = function (errors, window) {
                    var root = window.document.children[0];
                    var h1 = root.getElementsByTagName('h1')[0];
                    test.ok(def.match(h1), "should match correct tag");
                    test.done();
                };

                jsdom.env(html, [], testCase);
            },

            matches_regexp_contents: function (test) {
                var def = new MDPlus.Definition({
                    tag: 'h1',
                    content: /here/,
                    handler: true
                });
                var html = ['<h1>here</h1>' + 
                            '<h1>not</h1>' + 
                            '<h2>here</h2>'].join("");
                var testCase = function (errors, window) {
                    var root = window.document.children[0];
                    var matchedH1 = root.getElementsByTagName('h1')[0];
                    var unmatchedH1 = root.getElementsByTagName('h1')[1];
                    var matchedH2 = root.getElementsByTagName('h2')[0];
                    test.ok(def.match(matchedH1), "should match correct tag and matched contents");
                    test.ok(!def.match(unmatchedH1), "should not match correct tag and mismatched contents");
                    test.ok(!def.match(unmatchedH1), "should not match incorrect tag and matchd contents");
                    test.done();
                }
                
                jsdom.env(html, [], testCase);
            },

            matches_string_contents: function (test) {
                var def = new MDPlus.Definition({
                    tag: 'h1',
                    content: "here",
                    handler: true
                });
                var html = ['<h1>here</h1>' + 
                 '<h1>not</h1>' + 
                 '<h2>here</h2>'].join("");
                var testCase = function (errors, window) {
                    var root = window.document.children[0];
                    var matchedH1 = root.getElementsByTagName('h1')[0];
                    var unmatchedH1 = root.getElementsByTagName('h1')[1];
                    var matchedH2 = root.getElementsByTagName('h2')[0];
                    test.ok(def.match(matchedH1), "should match correct tag and matched contents");
                    test.ok(!def.match(unmatchedH1), "should not match correct tag and mismatched contents");
                    test.ok(!def.match(unmatchedH1), "should not match incorrect tag and matchd contents");
                    test.done();
                }

                jsdom.env(html, [], testCase);
            }
        }
    }
};