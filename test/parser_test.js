
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
            }
        }
    }
}