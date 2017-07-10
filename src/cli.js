#! /usr/bin/env node

import * as db from './db'
import path from 'path'

const config = require(path.join(process.cwd(), 'config.json'))
const connHandler = db.connect(config.db)

db.migrate(connHandler, err => {
  if (err) {
    console.log('error:', err)
    return
  }

  connHandler.destroy()
})
