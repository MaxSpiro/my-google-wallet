// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    query: { assetIds: rawAssetIds },
  } = req
  if (typeof rawAssetIds !== 'string') {
    res.status(400).json({ error: 'Invalid assetIds' })
    return
  }
  const assetIds = rawAssetIds.split(',')
  if (
    !assetIds ||
    !Array.isArray(assetIds) ||
    !(typeof assetIds[0] === 'string')
  ) {
    res.status(400).json({ error: 'Send assetIds in array form' })
    return
  }
  const prices: Record<string, string> = {}
  const response = await axios.get(
    `${process.env.CMC_BASEURL}/cryptocurrency/quotes/latest?symbol=${assetIds
      .map((assetId: string) => symbolFromId(assetId))
      .join(',')}`,
    {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.CMC_APIKEY ?? '',
        'Accept-Encoding': 'deflate, gzip',
        Accept: 'application/json',
      },
    },
  )
  for (const id of assetIds) {
    prices[id] =
      response.data.data[(symbolFromId(id))]?.[0]?.quote?.USD?.price?.toString()
  }
  res.status(200).json(JSON.stringify(prices))
}

function symbolFromId(id: string) {
  return id.split('-')[0].split('.')[1]
}