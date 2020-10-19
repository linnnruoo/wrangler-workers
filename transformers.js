/**
 * transformer classes for handling html elements
 */
const commons = require('./commons')

/**
 * Transformer class to transform the user profile
 * it displays the profile and sets the name and avatar
 */
class UserProfileTransformer {
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
      element.setAttribute(this.attributeName, commons.AVATAR_URL)
    }
  }

  displayName(element) {
    if (this.attributeName === 'name') {
      element.setInnerContent(commons.NAME)
    }
  }

  async element(element) {
    this.displayProfile(element)
    this.displayAvatar(element)
    this.displayName(element)
  }
}

/**
 * Transformer class to trasnform the links into hyperlink </a> format
 */
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

module.exports = {
  UserProfileTransformer,
  LinksTransformer,
}
