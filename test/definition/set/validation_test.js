

var MDPlus = require('../../../lib/md_plus.js');

exports.MDPlus = {
    Definition: {
        Set: {
            validate: {
                requires_a_value: function (test) {
                    var set = new MDPlus.Definition.Set();
                    var errors = set.validate();
                    var error = errors.errorForField('definitions');
                    test.ok(error, "should have an error if definitions aren't set");
                    test.done();
                },

                requires_array: function (test) {
                    var set = new MDPlus.Definition.Set(1);
                    var errors = set.validate();
                    var error = errors.errorForField('definitions');
                    test.ok(error, "should have an error if definitions isn't an array");
                    test.done();
                },

                requires_array_of_definitions: function (test) {
                    var set = new MDPlus.Definition.Set([1]);
                    var errors = set.validate();
                    var error = errors.errorForField('definitions');
                    test.ok(error, "should have an error if definitions isn't an array");
                    test.done();
                },

                requires_array_of_valid_definitions: function (test) {
                    var definition = new MDPlus.Definition({});
                    var set = new MDPlus.Definition.Set([definition]);
                    var errors = set.validate();
                    var error = errors.errorForField('definitions');
                    test.ok(error, "should have an error if any definition is invalid");
                    test.done();
                }
            }
        }
    }
};