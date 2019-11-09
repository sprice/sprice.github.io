const cookie = require('cookie')
const ua = require('universal-analytics')

const now = new Date().toISOString()
const returnBody = { statusCode: 200, body: "" }
const baseDomain = process.env.BASE_URL

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

  console.log('EVENT', event)

  const qs = event.queryStringParameters
  const tid = process.env.GOOGLE_ANALYTICS_ID
  const userAgent = event.headers['user-agent']
  const uip = event.headers['client-ip']
  const dr = event.headers['referer']
  const cn = qs.utm_campaign
  // utm_source
  // utm_medium
  // utm_term
  // utm_content

  // https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters
  params = {
    'v': 1,                                     // Protocol version
    tid,                                        // Tracking ID
    'aip': 1,                                   // Anonymize IP
    'ds': 'web',                                // Data source
    'cid': uuid,                                // Client ID
    uip,                                        // IP
    'ua': userAgent,                            // User Agent
    dr,                                         // Document Referrer
    't': 'pageview',                            // Hit Type
    'dp': page,                                 // Document path
    'dh': 'shawnprice.com',                     // Document host name
    cn,                                         // Campaign name
    // 'cs': cs,                                   // Campaign source
    // 'cm': cm,                                   // Campaign medium
    // 'ck': ck,                                   // Campaign keyword
    // 'cc': cc,                                   // Campaign content
    // 'ci': '',                                   // Campaign ID
    // 'gclid': '',                                // Google Ads ID
    // 'dclid': '',                                // Google Display Ads ID
}

console.log({params})

  visitor.pageview(page).send()

  return callback(null, returnBody);
}
