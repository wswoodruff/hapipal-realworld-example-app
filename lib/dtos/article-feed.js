'use strict';

const Joi = require('joi');
const DTO = require('./base');

module.exports = class ArticleBasic extends DTO {

    static schema = Joi.object().required().keys({
        articles: Joi.object().keys(/* ... */),
        articlesCount: Joi.number()
    });

    static get validation() {

        return {
            validate: (obj, opts) => new this(obj, { ...opts, stripUnknown: true })
        };
    }
};
