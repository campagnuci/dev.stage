import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { env } from '../config/env'
import { accessInviteLink } from '../functions/access-invite-link'

export const accessInviteLinkRoute: FastifyPluginAsyncZod = async (app) => {
  app.get('/invites/:subscriberId', {
    schema: {
      summary: 'Access invite link',
      tags: ['referral'],
      description: 'Redirects user to frontend subscription page and counts the access',
      params: z.object({
        subscriberId: z.string().uuid()
      }),
      response: {
        302: z.null()
      }
    }
  }, async (request, reply) => {
    const { subscriberId } = request.params

    await accessInviteLink({ subscriberId })

    const redirectUrl = new URL(env.WEB_URL)
    redirectUrl.searchParams.set('referrer', subscriberId)

    return reply.redirect(redirectUrl.toString(), 302)
  })
}

