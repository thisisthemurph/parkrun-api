const express = require('express')
const { processUser, scrapeUserName, userExists } = require('./scraper')

const app = express()
app.use(express.json())

app.get('/parkrun/api', (req, res) => res.json({'message': 'Hello Parkrun!'}))

app.get('/parkrun/api/:userId', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')

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

const port = 8181
app.listen(port, () => console.log(`Listening on port ${port}`))
