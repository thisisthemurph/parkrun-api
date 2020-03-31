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
 * Scrapes the parkrun.org.uk website for the given user's data
 * @param {String} userId the user ID to be scraped
 */
const processUser = async (userId) => {
  const eventURLs = await scrapeUserEvents(userId)

  const user = {
    id: userId,
    eventCount: eventURLs.length,
    events: await Promise.all(eventURLs.map(async (url) => {
      return await scrapeEventResults(url)
    }))
  }

  return user
}

/**
 * Scrapes the events (park run tracks) the user has attended
 */
const scrapeUserEvents = async (userId) => {
  const url = `https://www.parkrun.org.uk/results/athleteresultshistory/?athleteNumber=${userId}`

  const res = await fetch(url, {
    headers: {'User-Agent': 'Mozilla/5.0 (Android 4.4; Mobile; rv:41.0) Gecko/41.0 Firefox/41.0'}
  })
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

  // Force the code to wait for the random number of seconds

  const wait = ms => {
    const date = new Date()
    do {
      date2 = new Date()
    }
    while (date2 - date < ms)
  }

  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min)
  }

  wait(getRandomNumber(5000, 15000))

  // Back to the normal flow of the function

  const res = await fetch(eventUrl, {
    headers: {'User-Agent': 'Mozilla/5.0 (Android 4.4; Mobile; rv:41.0) Gecko/41.0 Firefox/41.0'}
  })
  const html = await res.text()
  const $ = cheerio.load(html)

  const event = {
    name: eventUrl.split('/')[3],
    url: eventUrl,
    runs: []
  }

  $('table:eq(2) tbody tr').each((i, row) => {
    const run = {
      date: null,
      number: null,
      position: null,
      time: null,
      ageGrade: null,
      pb: null
    }

    $(row).find('td').each((j, td) => {
      const tdValue = $(td).text().trim()

      switch (j) {
        case 0:
          const d = tdValue.split('/')
          run.date = new Date(`${d[2]}-${d[1]}-${d[0]}T00:00:00`)
          break

        case 1:
          run.number = +tdValue
          break

        case 2:
          run.position = +tdValue
          break

        case 3:
          const timeParts = tdValue.split(':').map(num => parseInt(num))

          let hours = 0
          let mins, secs
          if (timeParts.length === 2) {
            [mins, secs] = timeParts
          } else {
            [hours, mins, secs] = timeParts
          }

          run.time = hours * 3600 + mins * 60 + secs
          break

        case 4:
          run.ageGrade = tdValue
          break

        case 5:
          run.pb = Boolean(tdValue)
          break
      }
    })

    event.runs.push(run)
  })

  return event
}

module.exports = processUser
