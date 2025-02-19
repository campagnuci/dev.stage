import { inArray } from 'drizzle-orm'
import { db } from '../drizzle/client'
import { subscriptions } from '../drizzle/schema/subscriptions'
import { redis } from '../redis/client'

export async function getRanking() {
  const topThree = await redis.zrevrange('referral:ranking', 0, 2, 'WITHSCORES')
  const subscriberIdAndScore: Record<string, number> = {}

  for (let i = 0; i < topThree.length; i += 2) {
    subscriberIdAndScore[topThree[i]] = Number.parseInt(topThree[i + 1])
  }

  const subscribers = await db
    .select()
    .from(subscriptions)
    .where(inArray(subscriptions.id, Object.keys(subscriberIdAndScore)))

  const rankingWithScore = subscribers.map((sub) => {
    return {
      id: sub.id,
      name: sub.name,
      score: subscriberIdAndScore[sub.id]
    }
  })
    .sort((sub1, sub2) => {
      return sub2.score - sub1.score
    })

  return { ranking: rankingWithScore }
}
