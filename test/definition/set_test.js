

var MDPlus = require('../../md_plus.js');

exports.MDPlus = {
    Definition: {
        Set: {
            eachDefinition: {
                should_apply_to_each_definition: function (test) {
                    var set = new MDPlus.Definition.Set([
                        new MDPlus.Definition.Definition({
                            tag: 'h1', handler: function () {},
                            children: [
                                new MDPlus.Definition.Definition({
                                    tag: 'h2', handler: function () {},
                                    children: [
                                        new MDPlus.Definition.Definition({
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
            },

            getDefinition: {
                should_return_top_level_definition: function (test) {
                    var set = new MDPlus.Definition.Set([
                        new MDPlus.Definition.Definition({
                            tag: 'h1', handler: function () {},
                            ref: 'thing'
                        })
                    ]);

                    var definition = set.getDefinition('thing');
                    test.equal(definition.get('tag'), 'h1', "finds correct definition");
                    test.done();
                },
                
                should_return_nested_definition: function (test) {
                    var set = new MDPlus.Definition.Set([
                        new MDPlus.Definition.Definition({
                            tag: 'h1', handler: true, ref: 'thing',
                            children: [
                                new MDPlus.Definition.Definition({
                                    tag: 'h2', handler: true, ref: 'sub',
                                    children: [
                                        new MDPlus.Definition.Definition({
                                            tag: 'h3', handler: true, ref: 'other'
                                        })
                                    ]
                                })
                            ]
                        })
                    ]);

                    var definition = set.getDefinition('thing/sub/other');
                    test.equal(definition.get('tag'), 'h3', "finds correct definition");
                    test.done();
                },
                
                should_require_complete_match: function (test) {
                    var set = new MDPlus.Definition.Set([
                        new MDPlus.Definition.Definition({
                            tag: 'h1', handler: true, ref: 'thing',
                            children: [
                                new MDPlus.Definition.Definition({
                                    tag: 'h2', handler: true, ref: 'sub',
                                    children: [
                                        new MDPlus.Definition.Definition({
                                            tag: 'h3', handler: true, ref: 'other'
                                        })
                                    ]
                                })
                            ]
                        })
                    ]);

                    var definition = set.getDefinition('other');
                    test.equal(definition, undefined, "does not find definition");
                    test.done();
                }
            }
        }
    }
};
