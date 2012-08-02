

var MDPlus = require('../../md_plus.js');

exports.MDPlus = {
    Definition: {
        Set: {
            eachDefinition: {
                should_apply_to_each_definition: function (test) {
                    var set = new MDPlus.Definition.Set([
                        new MDPlus.Definition({
                            tag: 'h1', handler: function () {},
                            children: [
                                new MDPlus.Definition({
                                    tag: 'h2', handler: function () {},
                                    children: [
                                        new MDPlus.Definition({
                                            tag: 'h3', handler: function () {}
                                        })
                                    ]
                                })
                            ]
                        })
                    ]);
                    var foundTags = {};
                    var callback = function (definition) {
                        var tagName = definition.getTagName()
                        if (!foundTags[tagName]) {
                            foundTags[tagName] = 0;
                        }
                        foundTags[tagName] += 1;
                    }
                    set.eachDefinition(callback);

                    test.equal(foundTags['H1'], 1, "should encounter one h1");
                    test.equal(foundTags['H2'], 1, "should encounter one h2");
                    test.equal(foundTags['H3'], 1, "should encounter one h3");
                    test.done();
                }
            }
        }
    }
};
