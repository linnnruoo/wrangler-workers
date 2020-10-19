/**
 * Tasks:
 * 1. Deploy JSON API with links
 * 2. Set up HTML page
 * source:
 * https://developers.cloudflare.com/workers/examples/fetch-html
 * https://blog.cloudflare.com/introducing-htmlrewriter/
 * https://community.cloudflare.com/t/getting-post-parameters-via-request-formdata-prevents-forwarding-the-original-request/15349
 */
const Router = require('./router')
const transformers = require('./transformers')
const commons = require('./commons')

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

function JSONLinksHandler() {
  const init = {
    headers: { 'Content-Type': 'application/json' },
  }
  const body = JSON.stringify(commons.LINKS)
  return new Response(body, init)
}

async function HTMLHandler() {
  const init = { headers: { 'Content-Type': 'text/html' } }
  const pageResponse = await fetch(commons.STATIC_URL)

  const rewriter = new HTMLRewriter()
    .on('div#profile', new transformers.UserProfileTransformer('style'))
    .on('img#avatar', new transformers.UserProfileTransformer('src'))
    .on('h1#name', new transformers.UserProfileTransformer('name'))
    .on('body', new transformers.UserProfileTransformer('class'))
    .on('title', new transformers.UserProfileTransformer('title'))
    .on('div#links', new transformers.LinksTransformer(commons.LINKS))

  try {
    return rewriter.transform(pageResponse)
  } catch (err) {
    // for TypeError: This readable stream is currently locked to a reader.
    return new Response(pageResponse.text(), init)
  }
}

/**
 * Handle different routes
 * @param {Request} request
 */
async function handleRequest(request) {
  const router = new Router()
  router.get('/links', () => JSONLinksHandler())
  // return a default HTML page for any other routes
  router.get('.*', () => HTMLHandler())

  const response = await router.route(request)
  return response
}
