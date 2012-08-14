var jsdom = require('jsdom');

var MDPlus = require('../md_plus.js');

exports.MDPlus = {
    DomSpan: {
        each: {
            should_include_the_first_item: function (test) {
                var location = [0];
                var html = '<div><p><b>first element!</b></p><h2>subhead</h2></div>';
                var testCase = function (errors, window) {
                    var root = window.document.children[0];
                    var div = root.getElementsByTagName('div')[0];
                    var domTreeIterator = new MDPlus.DomTreeIterator(div);
                    var domSpan = new MDPlus.DomSpan(domTreeIterator);
                    var sawPTag = false
                    var handler = function (element) {
                        if (element.tagName === "P") {
                            sawPTag = true;
                        }
                    }
                    domSpan.pushLocation([0]);
                    domSpan.pushLocation([1]);

                    domSpan.each(handler);

                    test.ok(sawPTag, "should include the <p> tag");
                    test.done();
                };
                jsdom.env(html, [], testCase);
            },

            should_not_include_the_last_item: function (test) {
                var location = [0];
                var html = '<div><p><b>first element!</b></p><h2>subhead</h2></div>';
                var testCase = function (errors, window) {
                    var root = window.document.children[0];
                    var div = root.getElementsByTagName('div')[0];
                    var domTreeIterator = new MDPlus.DomTreeIterator(div);
                    var domSpan = new MDPlus.DomSpan(domTreeIterator);
                    var sawH2Tag = false
                    var handler = function (element) {
                        if (element.tagName === "H2") {
                            sawH2Tag = true;
                        }
                    }
                    domSpan.pushLocation([0]);
                    domSpan.pushLocation([1]);

                    domSpan.each(handler);

                    test.ok(!sawH2Tag, "should not include the <h2> tag");
                    test.done();
                };
                jsdom.env(html, [], testCase);
            }
        },

        dataWithin: {
            should_return_an_object: function (test) {
                var location = [0];
                var html = '<div><p>no data</p></div>';
                var testCase = function (errors, window) {
                    var root = window.document.children[0];
                    var div = root.getElementsByTagName('div')[0];
                    var domTreeIterator = new MDPlus.DomTreeIterator(div);
                    var domSpan = new MDPlus.DomSpan(domTreeIterator);
                    domSpan.pushLocation([0]);
                    domSpan.pushLocation([1]);

                    var result = domSpan.dataWithin();

                    test.equal(typeof(result), "object", "returns an object");
                    test.done();
                };
                jsdom.env(html, [], testCase);
            },
            
            should_include_json: function (test) {
                var location = [0];
                var html = '<div><p>some<code>{"value": "was"}</code></p></div>';
                var testCase = function (errors, window) {
                    var root = window.document.children[0];
                    var div = root.getElementsByTagName('div')[0];
                    var domTreeIterator = new MDPlus.DomTreeIterator(div);
                    var domSpan = new MDPlus.DomSpan(domTreeIterator);
                    domSpan.pushLocation([0]);
                    domSpan.pushLocation([1]);

                    var result = domSpan.dataWithin();

                    test.equal(result.value, "was", "includes correct data");
                    test.done();
                };
                jsdom.env(html, [], testCase);
            },

            should_not_include_non_json: function (test) {
                var location = [0];
                var html = '<div><p>some<code>{"value": "was"}</code>non<code>not: {"other": "is"}</code></p></div>';
                var testCase = function (errors, window) {
                    var root = window.document.children[0];
                    var div = root.getElementsByTagName('div')[0];
                    var domTreeIterator = new MDPlus.DomTreeIterator(div);
                    var domSpan = new MDPlus.DomSpan(domTreeIterator);
                    domSpan.pushLocation([0]);
                    domSpan.pushLocation([1]);

                    var result = domSpan.dataWithin();

                    test.equal(result.value, "was", "includes correct data");
                    test.equal(result.other, undefined, "does not include malformed data");
                    test.done();
                };
                jsdom.env(html, [], testCase);
            },

            should_include_all_matching_tags: function (test) {
                var location = [0];
                var html = '<div><p>some<code>{"value": "was"}</code>non<code>{"other": "is"}</code></p></div>';
                var testCase = function (errors, window) {
                    var root = window.document.children[0];
                    var div = root.getElementsByTagName('div')[0];
                    var domTreeIterator = new MDPlus.DomTreeIterator(div);
                    var domSpan = new MDPlus.DomSpan(domTreeIterator);
                    domSpan.pushLocation([0]);
                    domSpan.pushLocation([1]);

                    var result = domSpan.dataWithin();

                    test.equal(result.value, "was", "includes correct data");
                    test.equal(result.other, "is", "includes secondary data");
                    test.done();
                };
                jsdom.env(html, [], testCase);
            },

            should_interpret_data_in_order: function (test) {
                var location = [0];
                var html = '<div><p>some<code>{"value": "was"}</code>non<code>{"value": "is"}</code></p></div>';
                var testCase = function (errors, window) {
                    var root = window.document.children[0];
                    var div = root.getElementsByTagName('div')[0];
                    var domTreeIterator = new MDPlus.DomTreeIterator(div);
                    var domSpan = new MDPlus.DomSpan(domTreeIterator);
                    domSpan.pushLocation([0]);
                    domSpan.pushLocation([1]);

                    var result = domSpan.dataWithin();

                    test.equal(result.value, "is", "includes correct data");
                    test.done();
                };
                jsdom.env(html, [], testCase);
            }
        }
    }
}

