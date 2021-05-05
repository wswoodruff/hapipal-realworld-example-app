'use strict';

const Joi = require('joi');
const Article = require('../models/article');
const Tag = require('../models/tag');
const User = require('../models/user');
const DTO = require('./base');

module.exports = class ArticleDetailed extends DTO {

    static schema = Article.joiSchema.keys({
        tagList: Joi.array().items(Tag.field('name')).default([]),
        favorited: Joi.boolean(),
        favoritesCount: Joi.number(),
        following: Joi.array().items(Joi.object(/* ... */)),
        author: User.joiSchema.fork('password', (p) => p.strip())
    });

    static from(obj) {

        return new this({
            ...obj,
            tagList: obj.tags.map((t) => t.name),
            favorited: !!obj.favoritedBy.length,
            favoritesCount: obj.favoritedBy.length
        });
    }
};
