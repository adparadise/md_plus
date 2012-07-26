var jsdom = require('jsdom');

exports.test = function (test) {
    jsdom.env('<p>here</p>', [], function (errors, window) {
        test.expect(1);
        test.ok(true, "how about that");
        test.done();
    });
};

exports.other = function (test) {
    jsdom.env('<p>here</p>', [], function (errors, window) {
        test.expect(1);
        test.ok(true, "how about that");
        test.done();
    });
};