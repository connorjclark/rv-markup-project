import mysql from 'mysql'
import async from 'async'
const migrations = require('./schema/migrations.json')
const queries = require('./schema/queries.json')

// returns a handler
export function connect (options) {
  const connHandler = mysql.createConnection(options)
  connHandler.connect()
  return connHandler
}

// simple migration system
// maintains a version table in the schema
export function migrate (connHandler, done) {
  // 1) ensure version table exists. initialize with -1 if it doesn't exist already
  function createVersionTable (cb) {
    connHandler.query(`SHOW TABLES LIKE 'version'`, (err, results, fields) => {
      if (err) return cb(err)
      if (results.length !== 0) return cb(null)

      connHandler.query('CREATE TABLE version (version INTEGER)', (err, results, fields) => {
        if (err) return cb(err)

        connHandler.query('INSERT INTO version VALUES (-1)', (err) => {
          if (err) return cb(err)

          cb(null)
        })
      })
    })
  }

  // get current schema version number
  function getVersion (cb) {
    connHandler.query(`SELECT version from version LIMIT 1`, (err, results, fields) => {
      if (err) return cb(err)

      cb(null, results[0].version)
    })
  }

  // run the neccessary migrations to get schema up to date
  function runMigrations (version, cb) {
    // version represents the index of last migration ran on this db
    // if -1, no migrations have bene run

    function runMigrationVersion (version, migrationCb) {
      console.log(`running migration ${version}: ${migrations[version]}`)

      // use a transaction to ensure version is
      // incremented only if the migration succeeds
      connHandler.beginTransaction(function (err) {
        if (err) return migrationCb(err)

        connHandler.query(migrations[version], (err) => {
          if (err) return migrationCb(err)

          connHandler.query('UPDATE version SET version = version + 1 LIMIT 1', migrationCb)
        })
      })
    }

    if (version === migrations.length - 1) {
      console.log('no migrations to run')
      cb(null)
    } else {
      // https://stackoverflow.com/a/36963945/2788187
      // returns an array of numbers within specified range
      const range = (start, end) => Array.from({length: (end - start)}, (v, k) => k + start)

      const versionsToRun = range(version + 1, migrations.length)

      // run each migration, in series, run after the other. call `cb` when done
      async.eachSeries(versionsToRun, runMigrationVersion, cb)
    }
  }

  async.waterfall([
    createVersionTable,
    getVersion,
    runMigrations
  ], done)
}

export function add (connHandler, data, done) {
  connHandler.query(queries.insert, data, (err, results, fields) => {
    if (err) return done(err)

    done(null, results)
  })
}

export function get (connHandler, data, done) {
  // unfortunately, the mysqljs does not support named params,
  // so this repetition is required
  const params = [
    data.author, data.author,
    data.begin, data.begin,
    data.end, data.end
  ]

  connHandler.query(queries.get, params, (err, results, fields) => {
    if (err) return done(err)

    done(null, results)
  })
}

export function best (connHandler, done) {
  connHandler.query(queries.best, (err, results, fields) => {
    if (err) return done(err)

    done(null, results)
  })
}

export function worst (connHandler, done) {
  connHandler.query(queries.worst, (err, results, fields) => {
    if (err) return done(err)

    done(null, results)
  })
}

export function average (connHandler, done) {
  connHandler.query(queries.average, (err, results, fields) => {
    if (err) return done(err)

    done(null, results)
  })
}
