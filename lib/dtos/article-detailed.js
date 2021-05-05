'use strict';

const Joi = require('joi');
const Article = require('../models/article');
const Tag = require('../models/tag');
const Dto = require('./base');

module.exports = class ArticleDetailed extends Dto {

    static schema = Article.joiSchema.keys({
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
