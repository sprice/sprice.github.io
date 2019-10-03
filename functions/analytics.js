const cookie = require('cookie')
const ua = require('universal-analytics')

exports.handler = function(event, context, callback) {

  if (process.env.NETLIFY_DEV) {
    callback(null)
  }

  let baseDomain = process.env.BASE_DOMAIN

  const cookies = cookie.parse(event.headers.cookie)
  const uuid = cookies.uuid
  var visitor = ua(process.env.GOOGLE_ANALYTICS_ID, uuid)
  const page = event.headers.referer.split(baseDomain)[1]

  visitor.pageview(page).send()

  callback(null, {
  statusCode: 200,
  body: ""
  });
}
