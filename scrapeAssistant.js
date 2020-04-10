const fetch = require('node-fetch');
const cheerioAdv = require('cheerio-advanced-selectors')
const cheerio = cheerioAdv.wrap(require('cheerio'))

const headers = {
	'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
	'accept-encoding': 'gzip, deflate, br',
	'accept-language': 'en-US,en-GB;q=0.9,en;q=0.8',
	'cache-control': 'max-age=0',
	'sec-fetch-dest': 'document',
  'sec-fetch-mode': 'navigation',
	'sec-fetch-site': 'none',
	'sec-fetch-user': '?1',
	'upgrade-insecure-requests': 1,
	'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36'
}

const scrapeFetch = async (url) => {
  const res = await fetch(url, { headers })
  const html = await res.text()
  return cheerio.load(html)
}

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min)
}

/**
 * Forces the script to wait a ransom numner of milleseconds between minMs and maxMs
 * @param {number} minMs minimum time in milliseconds
 * @param {number} maxMs maximum time in milliseconds
 */
const wait = (minMs, maxMs) => {
  const ms = getRandomNumber(minMs, maxMs)
  const date = new Date()
  
  do {
    date2 = new Date()
  }
  while (date2 - date < ms)
}

module.exports = {
  scrapeFetch,
  wait
}
