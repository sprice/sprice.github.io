const cookie = require('cookie')
const ua = require('universal-analytics')

const returnBody = { statusCode: 200, body: "" }

exports.handler = function(event, context, callback) {

  if (process.env.NETLIFY_DEV) {
    callback(null, returnBody)
  }

  let baseDomain = process.env.BASE_DOMAIN

  if (!event.headers.cookie) {
    callback(null, returnBody)
  }

  console.log('here is the cookie', event.headers.cookie)
  console.log('typeof cookie', typeof event.headers.cookie)

  if (typeof event.headers.cookie != "string") {
    callback(null, returnBody)
  }

  const cookies = cookie.parse(event.headers.cookie)
  const uuid = cookies.uuid

  if (!uuid) {
    callback(null, returnBody)
  }

  var visitor = ua(process.env.GOOGLE_ANALYTICS_ID, uuid)
  const page = event.headers.referer.split(baseDomain)[1]

  visitor.pageview(page).send()

  callback(null, returnBody);
}
