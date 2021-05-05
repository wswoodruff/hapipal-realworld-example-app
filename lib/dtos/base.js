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

    static compose(frankenSchema) {

        const keys = {};
        const sharedSchemas = [];

        const getDTOSchemaLinkInfo = (dto) => {

            const name = BaseDTO.getName(dto);

            return {
                link: Joi.link(`#${name}`),
                shared: dto.schema.id(name)
            };
        };

        Object.entries(frankenSchema).forEach(([key, val]) => {

            // Here to match normalizr's array syntax
            if (Array.isArray(val)) {
                // Oops need to do other stuff here
                const { link, shared } = getDTOSchemaLinkInfo(val);
                keys[key] = Joi.array().items(link);
                sharedSchemas.push(shared);
            }
            else if (val instanceof BaseDTO) {
                const { link, shared } = getDTOSchemaLinkInfo(val);
                keys[key] = link;
                sharedSchemas.push(shared);
            }
        });

        const base = Joi.object().keys(keys);

        return !sharedSchemas.length ? base : sharedSchemas.reduce((finalSchema, link) => {

            return finalSchema.shared(link);
        }, base);
    }

    static getName(dto) {

        return dto.constructor.name;
    }

    static from(obj) {

        // This will skip validation, do we want to enforce?
        if (obj instanceof this) {
            return obj;
        }

        return new this(obj);
    }
};
