var MDPlus = require('../../lib/md_plus.js');

exports.definitionSet = function () {
    return new MDPlus.Definition.Set([
        new MDPlus.Definition({
            tag: 'h2',
            content: "Audio Equipment",
            handler: true,
            children: [
                new MDPlus.Definition({
                    tag: 'h3', content: "Walkmen",
                    handler: true
                }),
                new MDPlus.Definition({
                    tag: 'h3', content: "Cassettes",
                    handler: true
                })
            ]
        }),
        new MDPlus.Definition({
            tag: 'h2',
            content: "Technology",
            handler: true,
            children: [
                new MDPlus.Definition({
                    tag: 'h3', content: "Bazookas",
                    handler: true
                }),
                new MDPlus.Definition({
                    tag: 'h3', content: "Flux Capacitors",
                    handler: true
                })
            ]
        })
    ]);
};
