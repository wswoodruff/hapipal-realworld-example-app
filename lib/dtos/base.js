'use strict';

const Joi = require('joi');

module.exports = class BaseDTO {

    constructor(obj, opts) {

        const { value, error } = this.constructor.schema.validate(obj, opts);

        if (error) {
            throw error;
        }

        Object.assign(this, value);
    }

    static schema = Joi.any();

    static get validation() {

        return {
            validate: (obj, opts) => new this(obj, opts)
        };
    }

    static from(obj) {

        // This will skip validation, do we want to enforce?
        if (obj instanceof this) {
            return obj;
        }

        return new this(obj);
    }
};
