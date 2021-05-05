'use strict';

const Joi = require('joi');
const Helpers = require('../helpers');
const User = require('../../models/user');
const Tag = require('../../models/tag');
const ArticleFeed = require('../../dtos/article-feed');
const ArticleBasic = require('../../dtos/article-basic');

module.exports = Helpers.withDefaults({
    method: 'get',
    path: '/articles',
    options: {
        validate: {
            query: Joi.object({
                tag: Tag.field('name').empty(''),
                author: User.field('username').empty(''),
                favorited: User.field('username').empty(''),
                limit: Joi.number().integer().min(1).default(20),
                offset: Joi.number().integer().min(0).default(0)
            })
        },
        auth: { strategy: 'jwt', mode: 'optional' },
        handler: async (request) => {

            const { articleService } = request.services();

            const { articles, total } = await articleService.find(request.query);

            return ArticleFeed.from({
                articles: articles.map((article) => {

                    const a = ArticleBasic.from(article);
                    return a;
                }),
                articlesCount: total
            });
        }
    }
});
