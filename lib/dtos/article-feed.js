'use strict';

const Joi = require('joi');
const ArticleBasic = require('./article-basic');
const DTO = require('./base');

module.exports = class ArticleFeed extends DTO {

    static schema = DTO.compose({
        articles: [ArticleBasic],
        articlesCount: Joi.number()
    }).required();

    static get validation() {

        return {
            validate: (obj, opts) => new this(obj, { ...opts, stripUnknown: true })
        };
    }
};
