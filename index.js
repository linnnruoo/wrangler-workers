/**
 * Tasks:
 * 1. Deploy JSON API with links
 * 2. Set up HTML page
 */
const Router = require('./router')

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

function JSONHandler(request) {
  const init = {
    headers: { 'Content-Type': 'application/json' },
  }
  const body = JSON.stringify({ some: 'TEST' })
  return new Response(body, init)
}

function HTMLHandler(request) {
  const init = { headers: {  "Content-Type": "text/html" }}
  return new Response('Hellow', init)
}

/**
 * Handle different routes
 * @param {Request} request
 */
async function handleRequest(request) {
  const router = new Router()
  router.get('/links', (request) => JSONHandler(request))
  // return a default message for the root route
  router.get('/', (request) => HTMLHandler(request))

  const response = await router.route(request)
  return response
}
