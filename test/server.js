const express = require('express')
const fs = require('fs')
const {runner} = require('mocha-headless-chrome')

const app = express()

app.use(express.static('.'))
app.use(express.json())

app.get('/text', ({headers: {user = 'world'}}, res) => {
  res.set('user', user)
  res.send(`Hello, ${user}!`)
})

app.get('/json', ({headers: {user = 'world'}}, res) => {
  res.set('user', user)
  res.json({user: user})
})

app.get('/xml', ({headers: {user = 'world'}}, res) => {
  res.set('user', user)
  res.set('Content-Type', 'application/xml')
  res.send(`<?xml version="1.0"?><hello>${user}</hello>`)
})

app.get('/slow', (req, res) => {
  setTimeout(() => res.send('Still there?'), 1000)
})

app.post('/echo', (req, res) => {
  res.json(req.body)
})

app.listen(3000)

async function run() {
  const {
    coverage,
    result: {
      stats: {failures}
    }
  } = await runner({
    file: 'http://localhost:3000/test/index.html',
    args: ['no-sandbox', 'disable-setuid-sandbox']
  })

  if (!fs.existsSync('.nyc_output')) {
    fs.mkdirSync('.nyc_output')
  }

  fs.writeFileSync('.nyc_output/coverage.json', JSON.stringify(coverage))

  process.exit(failures ? 1 : 0)
}

run()
