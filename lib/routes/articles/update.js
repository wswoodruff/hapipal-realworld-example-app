'use strict';

const Joi = require('joi');
const Boom = require('@hapi/boom');
const Helpers = require('../helpers');
const ArticleModel = require('../../models/article');
const ArticleDTO = require('../../dtos/article');

module.exports = Helpers.withDefaults({
    method: 'put',
    path: '/articles/{slug}',
    options: {
        validate: {
            params: Joi.object({
                slug: ArticleModel.field('slug')
            }),
            payload: Joi.object({
                article: ArticleDTO.update.schema
            })
        },
        auth: 'jwt',
        handler: async (request, h) => {

            const { slug } = request.params;
            const { article: articleInfo } = request.payload;
            const { articleService, displayService } = request.services();
            const currentUserId = Helpers.currentUserId(request);

            const { id, authorId } = await articleService.findBySlug(slug);

            if (authorId !== currentUserId) {
                throw Boom.forbidden();
            }

            const updateAndFetchArticle = async (txn) => {

                await articleService.update(id, articleInfo, txn);

                return await articleService.findById(id, txn);
            };

            // const [article] = await h.context.transaction(updateAndFetchArticle);

            // console.log('ArticleDTO.detailed.from(article)', ArticleDTO.detailed.from(article));

            // return {
            //     article: ArticleDTO.detailed.from(article)
            // };

            // return {
            //     article: await displayService.articles(currentUserId, article)
            // };

            const article = await h.context.transaction(updateAndFetchArticle);

            return {
                article: await displayService.articles(currentUserId, article)
            };
        }
    }
});
