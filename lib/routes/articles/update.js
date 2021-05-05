'use strict';

const Joi = require('joi');
const Boom = require('@hapi/boom');
const Helpers = require('../helpers');
const Article = require('../../models/article');
const { ArticleDetailed } = require('../../dtos/article-detailed');

module.exports = Helpers.withDefaults({
    method: 'put',
    path: '/articles/{slug}',
    options: {
        validate: {
            params: Joi.object({
                slug: Article.field('slug')
            }),
            payload: Article.joiSchema
        },
        auth: 'jwt',
        handler: async (request, h) => {

            const { slug } = request.params;
            const { articleService } = request.services();
            const currentUserId = Helpers.currentUserId(request);

            const { id, authorId } = await articleService.findBySlug(slug);

            if (authorId !== currentUserId) {
                throw Boom.forbidden();
            }

            const updateAndFetchArticle = async (txn) => {

                await articleService.update(id, request.payload, txn);

                return await articleService.fetchArticlesByUser(currentUserId, id, txn);
            };

            const [article] = await h.context.transaction(updateAndFetchArticle);

            return {
                article: ArticleDetailed.from(currentUserId, article)
            };
        }
    }
});
