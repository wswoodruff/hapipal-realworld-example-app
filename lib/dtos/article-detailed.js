'use strict';

const Joi = require('joi');
const Article = require('../models/article');
const ArticleBasic = require('./article-basic');
const Tag = require('../models/tag');
const DTO = require('./base');

module.exports = class ArticleDetailed extends DTO {

    static schema = Article.joiSchema
        // .keys(ArticleBasic.schema)
        .keys({
            tagList: Joi.array().items(Tag.field('name')),
            favorited: Joi.boolean(),
            favoritesCount: Joi.number(),
            following: Joi.array().items(Joi.object(/* ... */))
        });

    static get validation() {

        return {
            validate: (obj, opts) => new this(obj, { ...opts, stripUnknown: true })
        };
    }
};
