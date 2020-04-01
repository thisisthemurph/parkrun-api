const express = require('express')
const { processUser, scrapeUserName, userExists } = require('./scraper')

const app = express()
app.use(express.json())

app.get('/parkrun/api', (req, res) => res.json({'message': 'Hello Parkrun!'}))

// const testUsers = {
//   user1: 5997634,
//   user2: 146388,
//   user3: 717551,
//   user4: 6106724  // has duration over 1 hour
// }

app.get('/parkrun/api/:userId', async (req, res) => {
  if (await userExists(req.params.userId)) {
    const user = await processUser(req.params.userId)
    user.name = await scrapeUserName(req.params.userId)
    res.json(user)
  } else {
    res.status(404).json({
      message: 'No user with that number has been identified'
    })
  }
})

const port = 3000
app.listen(port, () => console.log(`Listening on port ${port}`))
