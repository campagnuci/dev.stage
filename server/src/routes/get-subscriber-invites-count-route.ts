import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getSubscriberInvitesCount } from '../functions/get-subscriber-invites-count'

export const getSubscriberInvitesCountRoute: FastifyPluginAsyncZod = async (app) => {
  app.get('/subscribers/:subscriberId/ranking/count', {
    schema: {
      summary: 'Get subscriber invites count',
      tags: ['referral'],
      description: 'Get a count of the total of users subscribed by the invite of a user',
      params: z.object({
        subscriberId: z.string().uuid()
      }),
      response: {
        200: z.object({
          count: z.number()
        })
      }
    }
  }, async (request, reply) => {
    const { subscriberId } = request.params

    const { count } = await getSubscriberInvitesCount({ subscriberId })

    return { count }
  })
}

