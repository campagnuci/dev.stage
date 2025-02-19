import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getRanking } from '../functions/get-ranking'

export const getRankingRoute: FastifyPluginAsyncZod = async (app) => {
  app.get('/ranking', {
    schema: {
      summary: 'Get overall ranking',
      tags: ['referral'],
      description: 'Get the overall ranking sorted from higher to lowest with top 3',
      response: {
        200: z.object({
          ranking: z.array(
            z.object({
              id: z.string().uuid(),
              name: z.string(),
              score: z.number()
            })
          )
        })
      }
    }
  }, async (request) => {
    const { ranking } = await getRanking()

    return { ranking }
  })
}
