#! /usr/bin/env node

import * as db from './db'
import scorer from './scorer'
import program from 'commander'
import fs from 'fs'

const actions = {
  add: (connHandler, cb) => {
    const author = program.author
    const sourcePath = program.source
    const html = fs.readFileSync(sourcePath, 'utf8')

    db.add(connHandler, {
      html,
      score: scorer(html),
      author
    }, cb)
  }
}

program
  .version('1.0.0')
  .option('-h, --host <host>', 'mysql host')
  .option('-u, --user <user>', 'mysql user')
  .option('-p, --password <password>', 'mysql password')
  .option('-d, --database <database>', 'mysql database')
  .option('-s, --source [source]', 'html source file')
  .option('-a, --author [author]', 'html author')
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
