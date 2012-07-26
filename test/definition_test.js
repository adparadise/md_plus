
var MDPlus = require('../lib/md_plus.js');

exports.definition = {
    validate: {
        requires_tag: function (test) {
            var def = new MDPlus.Definition({});
            var errors = def.validate();
            var error = errors.errorForField('tag');
            test.ok(errors.errorCount() > 0, "should have at least one validation message");
            test.ok(error, "should have an error for the tag field");
            test.done();
        }
    }
};