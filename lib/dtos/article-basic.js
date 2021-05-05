'use strict';

const Joi = require('joi');
const Article = require('../models/article');
const DTO = require('./base');

module.exports = class ArticleBasic extends DTO {

    static schema = Joi.object({
        id: Article.field('id'),
        title: Article.field('title'),
        description: Article.field('description'),
        body: Article.field('body'),
        // tagList: Article.field('tagList')
    });

    static get validation() {

        return {
            validate: (obj, opts) => new this(obj, { ...opts, stripUnknown: true })
        };
    }
};
