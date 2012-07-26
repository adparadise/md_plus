var jsdom = require('jsdom');

var MDPlus = require('../lib/md_plus.js');

exports.definition = {
    validate: {
        tag: {
            required: function (test) {
                var def = new MDPlus.Definition({});
                var errors = def.validate();
                var error = errors.errorForField('tag');
                test.ok(error, "should have an error for the tag field");
                test.done();
            }
        },
        
        classRef: {
            required: function (test) {
                var def = new MDPlus.Definition({});
                var errors = def.validate();
                var error = errors.errorForField('classRef');
                test.ok(error, "should have an error for the classRef field");
                test.done();
            }
        },

        children: {
            array_if_present: function (test) {
                var def = new MDPlus.Definition({
                    tag: "h1",
                    classRef: true,
                    children: 1
                });
                var errors = def.validate();
                var error = errors.errorForField('children');
                test.ok(error, "should have an error for the children field");
                test.done();
            },

            contains_definitions: function (test) {
                var def = new MDPlus.Definition({
                    tag: "h1",
                    classRef: true,
                    children: [1]
                });
                var errors = def.validate();
                var error = errors.errorForField('children');
                test.ok(error, "should have an error for the children field");
                test.done();
            },

            are_all_valid: function (test) {
                var invalidDef = new MDPlus.Definition({});
                var def = new MDPlus.Definition({
                    tag: "h1",
                    classRef: true,
                    children: [invalidDef]
                });
                var errors = def.validate();
                var error = errors.errorForField('children');
                test.ok(error, "should have an error for the children field");
                test.ok(/invalid/.test(error.message), "should mention the invalid child");
                test.done();
            }
        }
    },

    match: {
        matches_tag: function (test) {
            var def = new MDPlus.Definition({
                tag: 'H1',
                classRef: true
            });

            jsdom.env('<h1>here</h1><h2>there</h2>', [], function (errors, window) {
                var root = window.document.children[0];
                var h1 = root.getElementsByTagName('h1')[0];
                var h2 = root.getElementsByTagName('h2')[0];
                test.ok(def.match(h1), "should match correct tag");
                test.ok(!def.match(h2), "should not match incorrect tag");
                test.done();
            });
        },

        matches_lowercase_tag_definition: function (test) {
            var def = new MDPlus.Definition({
                tag: 'h1',
                classRef: true
            });

            jsdom.env('<h1>here</h1>', [], function (errors, window) {
                var root = window.document.children[0];
                var h1 = root.getElementsByTagName('h1')[0];
                test.ok(def.match(h1), "should match correct tag");
                test.done();
            });
        }
    }
};