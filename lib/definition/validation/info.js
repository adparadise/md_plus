
/**
 * A class to contain validation errors and warnings.
 */
exports.Info = function () {
    this.initialize = function () {
        this._errors = [];
    };

    // assumes an error of the form:
    // { 
    //   level: ['error'], 
    //   field: <field name of concern>,
    //   message: <human readable error message>
    // }
    this.push = function (error) {
        if (error.level === 'error') {
            this._errors.push(error);
        }
    };

    this.errorCount = function () {
        return this._errors.length;
    };

    this.anyErrors = function () {
        return this._errors.length;
    };

    // Returns the first error marked for the field of concern.
    this.errorForField = function (field) {
        var index, error;
        var errorForField;
        for (index = this._errors.length; index--;) {
            error = this._errors[index];
            if (error.field === field) {
                errorForField = error;
                break;
            }
        }
        return errorForField;
    };

    this.initialize.apply(this, arguments);
};
