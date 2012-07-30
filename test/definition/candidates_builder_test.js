var MDPlus = require('../../lib/md_plus.js');

var definitionSet = function () {
    return new MDPlus.Definition.Set([
        new MDPlus.Definition({
            tag: 'h2',
            content: "Audio Equipment",
            classRef: true,
            children: [
                new MDPlus.Definition({
                    tag: 'h3', content: "Walkmen",
                    classRef: true
                }),
                new MDPlus.Definition({
                    tag: 'h3', content: "Cassettes",
                    classRef: true
                })
            ]
        }),
        new MDPlus.Definition({
            tag: 'h2',
            content: "Technology",
            classRef: true,
            children: [
                new MDPlus.Definition({
                    tag: 'h3', content: "Bazookas",
                    classRef: true
                }),
                new MDPlus.Definition({
                    tag: 'h3', content: "Flux Capacitors",
                    classRef: true
                })
            ]
        })
    ]);
};

var includesDefinition = function (candidates, tag, content) {
    var index, candidatesLength, definition;
    var isFound;
    candidatesLength = candidates.length;
    for (index = 0; index < candidatesLength; index++) {
        definition = candidates[index];
        if (definition.getTagName() === tag && definition.getContentPattern() === content) {
            isFound = true;
            break;
        }
    }
    return isFound;
};

exports.MDPlus = {
    Definition: {
        CandidatesBuilder: {
            getCandidatesAt: {
                includes_child_definitions: function (test) {
                    var set = definitionSet();
                    var builder = new MDPlus.Definition.CandidatesBuilder(set);
                    var candidates = builder.getCandidatesAt([0]);
                    test.ok(includesDefinition(candidates, 'H3', "Walkmen"), "should find the first child");
                    test.ok(includesDefinition(candidates, 'H3', "Cassettes"), "should find the second child");
                    test.done();
                },

                includes_peer_definitions: function (test) {
                    var set = definitionSet();
                    var builder = new MDPlus.Definition.CandidatesBuilder(set);
                    var candidates = builder.getCandidatesAt([0]);
                    test.ok(includesDefinition(candidates, 'H2', "Audio Equipment"), "should find the peer");
                    test.ok(includesDefinition(candidates, 'H2', "Technology"), "should find the peer");
                    test.done();
                },

                at_top_level: {
                    only_top_level_definitions: function (test) {
                        var set = definitionSet();
                        var builder = new MDPlus.Definition.CandidatesBuilder(set);
                        var candidates = builder.getCandidatesAt([]);
                        test.ok(includesDefinition(candidates, 'H2', "Audio Equipment"), "should find the peer");
                        test.ok(includesDefinition(candidates, 'H2', "Technology"), "should find the peer");
                        test.done();
                    }
                }
            }
        }
    }
}
