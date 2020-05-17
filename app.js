var path = require('path')
var http = require('http')
var express = require('express')
var config = require('./src/config.js')
var compression = require('compression')
var app = require('./src').default

// const app = express()
app.use(express.static(path.join(__dirname, 'frontend-cais/build')))
app.use(compression())

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || config.port)
app.set('port', port)

/**
 * Create HTTP server.
 */

var server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, '0.0.0.0', (err) => {
  if (err) { console.log(err) }
  console.info(`==> 🌎 app listening on http://localhost:${port} in ${process.env.NODE_ENV} mode`)
})

server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort (val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening () {
  var addr = server.address()
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  console.log('Listening on ' + bind)
}

module.exports = app
