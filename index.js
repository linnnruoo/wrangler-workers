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

// This HTML page contains all the necessary div
const STATIC_URL = 'https://static-links-page.signalnerve.workers.dev'
const AVATAR_URL = 'https://i.imgur.com/e1m6jaY.jpg'
const NAME = 'Lynn Bao'
const LINKS = [
  { name: 'Personal', url: 'https://linruolynn.com' },
  { name: 'GitHub', url: 'https://github.com/linnnruoo' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/linruolynn/' },
]

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

function JSONLinksHandler() {
  const init = {
    headers: { 'Content-Type': 'application/json' },
  }
  const body = JSON.stringify(LINKS)
  return new Response(body, init)
}

class LinksTransformer {
  constructor(links) {
    this.links = links
  }

  async element(element) {
    const parsedLinks = this.links.map(
      link => `<a href="${link.url}">${link.name}</a>`,
    )
    element.setInnerContent(parsedLinks, { html: true })
  }
}

class ElementTransformer {
  constructor(attributeName) {
    this.attributeName = attributeName
    this.displayProfile = this.displayProfile.bind(this)
    this.displayAvatar = this.displayAvatar.bind(this)
    this.displayName = this.displayName.bind(this)
  }

  displayProfile(element) {
    const attribute = element.getAttribute(this.attributeName)
    if (attribute && this.attributeName === 'style') {
      element.setAttribute(
        this.attributeName,
        attribute.replace('display: none', ''),
      )
    }
  }

  displayAvatar(element) {
    if (this.attributeName === 'src') {
      element.setAttribute(this.attributeName, AVATAR_URL)
    }
  }

  displayName(element) {
    if (this.attributeName === 'name') {
      element.setInnerContent(NAME)
    }
  }

  async element(element) {
    this.displayProfile(element)
    this.displayAvatar(element)
    this.displayName(element)
  }
}

async function HTMLHandler() {
  const init = { headers: { 'Content-Type': 'text/html' } }
  const pageResponse = await fetch(STATIC_URL)

  const rewriter = new HTMLRewriter()
    .on('div#profile', new ElementTransformer('style'))
    .on('img#avatar', new ElementTransformer('src'))
    .on('h1#name', new ElementTransformer('name'))
    .on('div#links', new LinksTransformer(LINKS))

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
