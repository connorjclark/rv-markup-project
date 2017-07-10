#! /usr/bin/env node

import * as db from './db'
import scorer from './scorer'
import program from 'commander'
import fs from 'fs'
import path from 'path'
import async from 'async'
import Table from 'cli-table'

const actions = {
  // process all .html files in data/
  init: (connHandler, done) => {
    const items = fs.readdirSync('data/')

    async.eachSeries(items, (item, cb) => {
      if (!item.endsWith('.html')) return cb(null)

      // ASSUMPTION: key contains no underscores
      const html = fs.readFileSync(path.join('data', item), 'utf8')
      const item_split = item.split('_')
      const key = item_split[0]
      const date = new Date(
        parseInt(item_split[1]),
        parseInt(item_split[2]) - 1,
        parseInt(item_split[3])
      )

      db.add(connHandler, {
        html,
        score: scorer(html),
        author: key,
        created_at: date
      }, cb)
    }, done)
  },
  // process html at given file
  add: (connHandler, done) => {
    const author = program.author
    const sourcePath = program.source
    const html = fs.readFileSync(sourcePath, 'utf8')

    db.add(connHandler, {
      html,
      score: scorer(html),
      author,
      created_at: Date.now()
    }, done)
  },
  get: (connHandler, done) => {
    const author = program.author
    const begin = new Date(program.begin)
    const end = new Date(program.end)

    db.get(connHandler, {
      author,
      begin,
      end
    }, (err, results) => {
      if (err) return done(err)

      console.log(format(results))
      done(null)
    })
  },
  best: (connHandler, done) => {
    db.best(connHandler, (err, results) => {
      if (err) return done(err)

      console.log(format(results))
      done(null)
    })
  },
  worst: (connHandler, done) => {
    db.worst(connHandler, (err, results) => {
      if (err) return done(err)

      console.log(format(results))
      done(null)
    })
  },
  average: (connHandler, done) => {
    db.average(connHandler, (err, results) => {
      if (err) return done(err)

      console.log(format(results))
      done(null)
    })
  }
}

function format(resultSet) {
  const keys = Object.keys(resultSet[0])
  const widths = keys.map(key => {
    return resultSet[0][key] instanceof Date ? 25 : 15
  })
  const table = new Table({ head: keys, colWidths: widths })

  for (const row of resultSet) {
    table.push(keys.map(key => row[key]))
  }

  return table.toString()
}

program
  .version('1.0.0')
  .option('-h, --host <host>', 'mysql host')
  .option('-u, --user <user>', 'mysql user')
  .option('-p, --password <password>', 'mysql password')
  .option('-d, --database <database>', 'mysql database')
  .option('-s, --source [source]', 'html source file')
  .option('-a, --author [author]', 'html author')
  .option('-b, --begin [begin]', 'query beginning date')
  .option('-e, --end [end]', 'query ending date')
  .action(action => {
    const connHandler = db.connect({
      'host': program.host,
      'user': program.user,
      'password': program.password,
      'database': program.database
    })

    db.migrate(connHandler, err => {
      if (err) {
        return console.log('error:', err)
      }

      if (action in actions) {
        actions[action](connHandler, err => {
          if (err) return console.log('error:', err)

          connHandler.destroy()
        })
      } else {
        console.log('invalid action. try: ', Object.keys(actions))
        connHandler.destroy()
      }
    })
  })
  .parse(process.argv)
