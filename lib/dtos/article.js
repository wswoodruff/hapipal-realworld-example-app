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
    })
        .concat(exports.basic.schema);

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

exports.updateResponse = class ArticleUpdateResponse extends DTO {

    static from(obj) {

        const {
            tags,
            favorited,
            favoritesCount,
            author,
            ...article
        } = obj;

        const toProfile = ({ password, email, following, ...user }) => ({
            ...user,
            following: (following.length > 0)
        });

        return new this({
            ...article,
            tagList: !tags ? [] : tags.map((tag) => tag.name),
            favorited: (favorited.length > 0),
            favoritesCount: favoritesCount[0] ? favoritesCount[0].count : 0,
            author: toProfile(author)
        });
    }
};
