const cookie = require('cookie')
const ua = require('universal-analytics')
const queryString = require('query-string')

const now = new Date().toISOString()
const returnBody = { statusCode: 200, body: "" }
const baseDomain = process.env.BASE_URL

const log = (msg, value) => {
  console.log(`${now}: ${msg} :: ${value}`)
}

exports.handler = function(event, context, callback) {
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

  var visitor = ua(process.env.GOOGLE_ANALYTICS_ID)
  const page = event.headers.referer.split(baseDomain)[1]

  const qs = queryString.parseUrl(page)
  const tid = process.env.GOOGLE_ANALYTICS_ID
  const userAgent = event.headers['user-agent']
  const uip = event.headers['client-ip']
  const dr = event.headers['referer']
  const geoid = event.headers['x-country']
  const cn = qs.query.utm_campaign
  const cs = qs.query.utm_source
  const cm = qs.query.utm_medium
  const ck = qs.query.utm_term
  const cc = qs.query.utm_content

  // https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters
  params = {
    'v': 1,                                     // Protocol version
    tid,                                        // Tracking ID
    'aip': 1,                                   // Anonymize IP
    'ds': 'web',                                // Data source
    'cid': uuid,                                // Client ID
    uip,                                        // IP
    geoid,                                      // Geo ID
    'ua': userAgent,                            // User Agent
    dr,                                         // Document Referrer
    't': 'pageview',                            // Hit Type
    'dp': page,                                 // Document path
    'dh': 'shawnprice.com',                     // Document host name
    cn,                                         // Campaign name
    cs,                                         // Campaign source
    cm,                                         // Campaign medium
    ck,                                         // Campaign keyword
    cc,                                         // Campaign content
    // 'ci': '',                                // Campaign ID
    // 'gclid': '',                             // Google Ads ID
    // 'dclid': '',                             // Google Display Ads ID
}

  if (process.env.NETLIFY_DEV) {
    console.log({params})
    log('Exiting: will not run on dev environment')
    return callback(null, returnBody)
  } else {
    console.log('params', params)
    visitor.pageview(params, err => {
      if (err) {
        console.log('Error Tracking Pageview', err)
      }
      log('Pageview tracked', uuid)
    })
    return callback(null, returnBody);
  }
}
