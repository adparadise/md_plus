
var Definition = {};
Definition.Validation = require('./definition/validation.js');
Definition.Definition = require('./definition/definition.js').Definition;
Definition.Set = require('./definition/set.js').Set;
Definition.CandidatesBuilder = require('./definition/candidates_builder.js').CandidatesBuilder;
Definition.Builder = require('./definition/builder.js').Builder;

exports.Definition = Definition;