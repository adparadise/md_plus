var MDPlus = require('../../lib/md_plus.js');

exports.definitionSet = function () {
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
