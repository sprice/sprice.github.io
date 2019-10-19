const cookie = require('cookie')
const ua = require('universal-analytics')

const now = new Date().toISOString()
const returnBody = { statusCode: 200, body: "" }
const baseDomain = process.env.BASE_DOMAIN

const log = (msg, value) => {
  console.log(`${now}: ${msg} :: ${value}`)
}

exports.handler = function(event, context, callback) {

  if (process.env.NETLIFY_DEV) {
    log('Exiting: will not run on dev environment')
    return callback(null, returnBody)
  }

  if (!event.headers.cookie) {
    log('Exiting: No cookies received')
    return callback(null, returnBody)
  }

  if (typeof event.headers.cookie != "string") {
    log('Exiting: cookies are not a string', event.headers.cookie)
    return callback(null, returnBody)
  }

  const cookies = cookie.parse(event.headers.cookie)
  const uuid = cookies.uuid

  if (!uuid) {
    log('Exiting: no uuid on cookies', cookies)
    return callback(null, returnBody)
  }

  var visitor = ua(process.env.GOOGLE_ANALYTICS_ID, uuid)
  const page = event.headers.referer.split(baseDomain)[1]

  log('Pageview tracked', uuid)
  visitor.pageview(page).send()

  return callback(null, returnBody);
}
