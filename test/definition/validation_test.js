var MDPlus = require('../../lib/md_plus.js');

exports.MDPlus = {
    Definition: {
        validate: {
            description_provided: function (test) {
                var def = new MDPlus.Definition();
                var errors = def.validate();
                test.ok(errors.anyErrors(), "should be invalid");
                test.done();
            },

            tag: {
                required: function (test) {
                    var def = new MDPlus.Definition({});
                    var errors = def.validate();
                    var error = errors.errorForField('tag');
                    test.ok(error, "should have an error for the tag field");
                    test.done();
                }
            },
            
            handler: {
                required: function (test) {
                    var def = new MDPlus.Definition({});
                    var errors = def.validate();
                    var error = errors.errorForField('handler');
                    test.ok(error, "should have an error for the handler field");
                    test.done();
                }
            },

            children: {
                array_if_present: function (test) {
                    var def = new MDPlus.Definition({
                        tag: "h1",
                        handler: true,
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
                        handler: true,
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
                        handler: true,
                        children: [invalidDef]
                    });
                    var errors = def.validate();
                    var error = errors.errorForField('children');
                    test.ok(error, "should have an error for the children field");
                    test.ok(/invalid/.test(error.message), "should mention the invalid child");
                    test.ok(error.isBubbledUp, "should be a bubbled up error");
                    test.done();
                }
            }
        },
    }
};
