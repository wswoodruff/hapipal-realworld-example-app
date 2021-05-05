'use strict';

const Joi = require('joi');
const DTO = require('./base');
const ArticleBasic = require('./article-basic');

module.exports = class ArticleFeed extends DTO {

    static schema = Joi.object().required().keys({
        articles: Joi.array().items(ArticleBasic.schema),
        articlesCount: Joi.number()
    });

    static get validation() {

        return {
            validate: (obj, opts) => new this(obj, { ...opts, stripUnknown: true })
        };
    }
};
