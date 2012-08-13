

var MDPlus = require('./lib/md_plus.js');


// Programmatic approach to building definitions
var description = new MDPlus.Definition.Set([
    new MDPlus.Definition({
        tag: 'h2',
        content: /^Sprints/,
        classRef: Sprint.Collection,
        children: [
            new MDPlus.Definition({
                tag: 'h3',
                classRef: Sprint
            })
        ]
    })
]);
description.bakeIDs();

// A pure data declaration of the parser state.
[{
    tag: 'h2', content: /^Sprints/,
    classRef: Sprint.Collection,
    children: [{
        tag: 'h3'
        classRef: Sprint
    },{
        tag: 'h3', content: /^Details/,
        classRef: Details
    }]
}]

// Additional metadata pertaining to the set.
{
    set: [{
        tag: 'h2', content: /^Sprints/,
        handler: instance.newSprint
        children: [{
            tag: 'h3'
            handler: instance.h3Found
        },{
            tag: 'h3', content: /^Details/,
            handler: instance.detailsFound
        }]
    }],
    complete: instance.complete
}

// Wrapping of parser in a handler pattern
{
    builder: TreeBuilder,
    appendMethodName: 'addChild'
    set: [{
        tag: 'h2', content: /^Sprints/,
        classRef: TreeNode
        children: [{
            tag: 'h3'
            classRef: TreeNode
        },{
            tag: 'h3', content: /^Details/,
            classRef: TreeNode
        }]
    }],
}
TreeBuilder.bakeDefinitions(set);


// Decouple handler actions from data definition
set = DefinitionSet.build({
    set: [{
        ref: 'header', tag: /^h[0-9]$/i
        children: [{
            ref: 'story', tag: 'li',
        }]
    }]
});
set.getDefinition('header').setHandler(this._stack.handler, this._stack);
set.getDefinition(['header', 'story']).setHandler(this.addStory, this);
