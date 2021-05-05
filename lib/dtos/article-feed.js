'use strict';

const Joi = require('joi');
const DTO = require('./base');
const ArticleDetailed = require('./article-detailed');

module.exports = class ArticleFeed extends DTO {

    static schema = Joi.object().required().keys({
        articles: Joi.array().items(ArticleDetailed.schema),
        articlesCount: Joi.number()
    });
};
