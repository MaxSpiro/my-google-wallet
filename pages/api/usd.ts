// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    query: { symbols },
  } = req
  if (!symbols) {
    res.status(400).json({ error: 'Missing symbols in query' })
    return
  }
  if (Array.isArray(symbols) || !/^(([a-zA-Z](,)?)*)+$/.test(symbols)) {
    res.status(400).json({
      error:
        'Symbols should be a comma separated list with no spaces (e.g. ETH,BTC,BNB)',
    })
    return
  }
  const prices: Record<string, string> = {}
  const response = await axios.get(
    `${
      process.env.CMC_BASEURL
    }/v2/cryptocurrency/quotes/latest?symbol=${symbols.toUpperCase()}`,
    {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.CMC_APIKEY ?? '',
        'Accept-Encoding': 'deflate, gzip',
        Accept: 'application/json',
      },
    },
  )
  for (const symbol of symbols.split(',')) {
    console.log(response.data.data[symbol])
    prices[symbol] =
      response.data.data[symbol]?.[0]?.quote?.USD?.price?.toString()
  }
  res.status(200).json(JSON.stringify(prices))
}
