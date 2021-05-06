'use strict';

const Joi = require('joi');

const DTO = require('./base');

const ArticleModel = require('../models/article');
const Tag = require('../models/tag');
const User = require('../models/user');

exports.basic = class ArticleBasic extends DTO {

    static schema = Joi.object({
        id: ArticleModel.field('id'),
        title: ArticleModel.field('title'),
        description: ArticleModel.field('description'),
        body: ArticleModel.field('body')
    });
};

exports.detailed = class ArticleDetailed extends DTO {

    static schema = Joi.object({
        id: Joi.number().integer().greater(0),
        createdAt: Joi.date(),
        updatedAt: Joi.date(),
        authorId: Joi.number().integer().greater(0),
        slug: Joi.string(),
        title: Joi.string(),
        description: Joi.string(),
        body: Joi.string(),
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

exports.feed = class ArticleFeed extends DTO {

    static schema = Joi.object({
        articles: Joi.array().items(exports.detailed.schema),
        articlesCount: Joi.number()
    });
};

exports.update = class ArticleUpdate extends DTO {

    static schema = Joi.object({
        title: ArticleModel.field('title'),
        description: ArticleModel.field('description'),
        body: ArticleModel.field('body'),
        tagList: Joi.array().items(Tag.field('name'))
    });
};
