var jsdom = require('jsdom');

var MDPlus = require('../lib/md_plus.js');

exports.MDPlus = {
    DomTreeSpan: {
        next: {
            should_traverse_down_if_element_is_traversable: function (test) {
                var location = [0];
                var html = '<div><p><b>first element!</b></p></div>';
                var testCase = function (errors, window) {
                    var root = window.document.children[0];
                    var div = root.getElementsByTagName('div')[0];
                    var domTreeSpan = new MDPlus.DomTreeSpan(div);
                    var nextLocation = domTreeSpan.next(location);

                    test.deepEqual(nextLocation, [0, 0], "should find the <b> tag from the <p> tag");
                    test.done();
                };
                jsdom.env(html, [], testCase);
            },

            should_skip_non_elements_in_child_list: function (test) {
                var location = [0];
                var html = '<div><p>some text <b>title!</b> and more</p></div>';
                var testCase = function (errors, window) {
                    var root = window.document.children[0];
                    var div = root.getElementsByTagName('div')[0];
                    var domTreeSpan = new MDPlus.DomTreeSpan(div);
                    var nextLocation = domTreeSpan.next(location);

                    test.deepEqual(nextLocation, [0, 1], "should find the <b> tag from the <p> tag");
                    test.done();
                };
                jsdom.env(html, [], testCase);
            },

            should_traverse_on_bottom_level: function (test) {
                var location = [0, 1];
                var html = '<div><p>some text <b>title!</b> and <b>more</b></p></div>';
                var testCase = function (errors, window) {
                    var root = window.document.children[0];
                    var div = root.getElementsByTagName('div')[0];
                    var domTreeSpan = new MDPlus.DomTreeSpan(div);
                    var nextLocation = domTreeSpan.next(location);

                    test.deepEqual(nextLocation, [0, 3], "should find the second <b> tag within the <p> tag");
                    test.done();
                };
                jsdom.env(html, [], testCase);
            },
            
            should_traverse_up_one_level_if_bottom_level_consumed: function (test) {
                var location = [0, 1];
                var html = '<div><p>some text <b>title!</b></p><h2>next headline</h2></div>';
                var testCase = function (errors, window) {
                    var root = window.document.children[0];
                    var div = root.getElementsByTagName('div')[0];
                    var domTreeSpan = new MDPlus.DomTreeSpan(div);
                    var nextLocation = domTreeSpan.next(location);

                    test.deepEqual(nextLocation, [1], "should find the <h2> tag from the <b> tag");
                    test.done();
                };
                jsdom.env(html, [], testCase);
            },

            should_traverse_up_many_levels_if_bottom_level_consumed: function (test) {
            },

        },

        getElementsByTagName: {
            topLevel: {
                should_include_matching_tags: function (test) {
                    var html = '<p>here</p>'; 
                    var testCase = function (errors, window) {
                        var root = window.document.children[0];
                        var span = new MDPlus.DomTreeSpan(root);
                        var elements;
                        span.setBounds([0], [1]);
                        
                        elements = span.getElementsByTagName('p');
                        test.equal(elements.length, 1, "should find one paragraph tag");
                        test.done();
                    }
                    jsdom.env(html, [], testCase);
                }
            }
        }
    }
};