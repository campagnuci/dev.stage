import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getSubscriberInviteClicks } from '../functions/get-subscriber-invite-clicks'

export const getSubscriberInviteClicksRoute: FastifyPluginAsyncZod = async (app) => {
  app.get('/subscribers/:subscriberId/ranking/clicks', {
    schema: {
      summary: 'Get subscriber invite clicks count',
      tags: ['referral'],
      description: 'Get a count of the amount of clicks an user invite link has',
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

    const { count } = await getSubscriberInviteClicks({ subscriberId })

    return { count }
  })
}

