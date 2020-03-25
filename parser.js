let cheerio = require('cheerio');
const cheerioAdv = require('cheerio-advanced-selectors')
const fetch = require('node-fetch');

cheerio = cheerioAdv.wrap(cheerio)

// 
//  URL for all user stats
//  Gets list of all tracks
//  https://www.parkrun.org.uk/results/athleteresultshistory/?athleteNumber=146388
//  
//  URL pattern for getting user info from specific track
//  https://www.parkrun.org.uk/[EVENT]/results/athletehistory/?athleteNumber=[NUMBER]
// 

/**
 * Scrapes the parkrun.org.uk website for the given users data
 * @param {String} userId the user ID to be scraped
 */
const processUser = async (userId) => {
  const eventURLs = await scrapeUserEvents(userId)
  console.log(eventURLs)

  eventURLs.forEach(async (url) => {
    const events = await scrapeEventResults(url)
    console.log(events)
    console.log('----------------------------------------------------')
  });
}

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

  return eventLinks
}

/**
 * Scrapes the users 'All Results' table for the event page
 *  the input url will follow the following pattern
 *  https://www.parkrun.org.uk/[EVENT]/results/athletehistory/?athleteNumber=[NUMBER]
 *  
 * @param {String} eventUrl the url to be scraped
 * @returns an Array of objects containing event data
 */
const scrapeEventResults = async (eventUrl) => {
  const eventName = eventUrl.split('/')[3]

  const res = await fetch(eventUrl)
  const html = await res.text()
  const $ = cheerio.load(html)

  const events = []
  $('table:eq(2) tbody tr').each((i, row) => {
    const eventData = {
      event: eventName,
      date: null,
      runNumber: null,
      position: null,
      time: null,
      ageGrade: null,
      pb: null
    }

    $(row).find('td').each((j, td) => {
      const tdValue = $(td).text().trim()

      switch (j) {
        case 0:
          eventData.date = tdValue
          break
        case 1:
          eventData.runNumber = tdValue
          break
        case 2:
          eventData.position = tdValue
          break
        case 3:
          eventData.time = tdValue
          break
        case 4:
          eventData.ageGrade = tdValue
          break
        case 5:
          eventData.pb = tdValue
          break
      }
    })

    events.push(eventData)
  })

  return events
}

module.exports = processUser
