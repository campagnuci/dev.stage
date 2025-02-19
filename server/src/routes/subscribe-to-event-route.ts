import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { subscribeToEvent } from '../functions/subscribe-to-event'

export const subscribeToEventRoute: FastifyPluginAsyncZod = async (app) => {
  app.post('/subscriptions', {
    schema: {
      summary: 'Subscribe user to event',
      tags: ['subscription'],
      description: 'Required info to subscribe a user to an event',
      body: z.object({
        name: z.string(),
        email: z.string().email(),
        referrerId: z.string().nullish(),
      }),
      response: {
        201: z.object({
          subscriberId: z.string().uuid()
        })
      }
    }
  }, async (request, reply) => {
    const { name, email, referrerId } = request.body
    const { subscriberId } = await subscribeToEvent({ name, email, referrerId })
    return reply.status(201).send({ subscriberId })
  })
}

