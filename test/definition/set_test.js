

var MDPlus = require('../../lib/md_plus.js');

exports.MDPlus = {
    Definition: {
        Set: {
            isValid: {
                requires_a_value: function (test) {
                    var set = new MDPlus.Definition.Set();
                    test.ok(!set.isValid(), "should be false if definitions aren't set");
                    test.done();
                },

                requires_array: function (test) {
                    var set = new MDPlus.Definition.Set(1);
                    test.ok(!set.isValid(), "should be false if definitions isn't an array");
                    test.done();
                },

                requires_array_of_definitions: function (test) {
                    var set = new MDPlus.Definition.Set([1]);
                    test.ok(!set.isValid(), "should be false if definitions isn't an array");
                    test.done();
                },

                requires_array_of_valid_definitions: function (test) {
                    var definition = new MDPlus.Definition({});
                    var set = new MDPlus.Definition.Set([definition]);
                    test.ok(!set.isValid(), "should be false if any definition is invalid");
                    test.done();
                }
            }
        }
    }
};