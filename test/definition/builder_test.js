

var MDPlus = require('../../md_plus.js');

exports.MDPlus = {
    Definition: {
        Builder: {
            build: {
                should_create_set: function (test) {
                    var builder = new MDPlus.Definition.Builder()
                    var set = builder.build([{
                        tag: 'h1', handler: function () {},
                        children: [{
                            tag: 'h2', handler: function () {},
                            children: [{
                                tag: 'h3', handler: function () {}
                            }]
                        }]
                    }]);
                    test.equal(typeof(set), "object", "an object was returned");
                    test.done();
                },
                
                should_include_definitions: function (test) {
                    var builder = new MDPlus.Definition.Builder()
                    var set = builder.build([{
                        tag: 'h1', handler: function () {},
                        children: [{
                            tag: 'h2', handler: function () {},
                            children: [{
                                tag: 'h3', handler: function () {}
                            }]
                        }]
                    }]);
                    var definition = set.getChildAt(0);
                    test.equal(definition.get('tag'), "h1", "top level tag found");
                    test.done();
                }
            }
        }
    }
}
