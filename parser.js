let cheerio = require('cheerio');
const cheerioAdv = require('cheerio-advanced-selectors')
const fetch = require('node-fetch');

cheerio = cheerioAdv.wrap(cheerio)

/**
 * URL for all user stats
 * Gets list of all tracks
 * https://www.parkrun.org.uk/results/athleteresultshistory/?athleteNumber=146388
 * 
 * URL pattern for getting user info from specific track
 * https://www.parkrun.org.uk/[EVENT]/results/athletehistory/?athleteNumber=[NUMBER]
 */

/**
 * Scrapes the events (park run tracks) the user has attended
 */
const scrapeUserEvents = async (userId) => {
  const url = `https://www.parkrun.org.uk/results/athleteresultshistory/?athleteNumber=${userId}`

  const res = await fetch(url)
  const html = await res.text()
  const $ = cheerio.load(html)

  const eventLinks = []
  $('tbody tr td:nth-child(6)').find('a').each((i, elem) => {
    eventLinks.push($(elem).attr('href'))
  })

  console.log(eventLinks)
  return eventLinks
}

module.exports = {
  scrapeUserEvents
}
