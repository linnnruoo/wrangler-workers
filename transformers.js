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
    this.setAvatar = this.setAvatar.bind(this)
    this.setName = this.setName.bind(this)
    this.changeBackground = this.changeBackground.bind(this)
  }

  displayProfile(element, attribute) {
    if (attribute && this.attributeName === 'style') {
      element.setAttribute(
        this.attributeName,
        attribute.replace('display: none', ''),
      )
    }
  }

  setAvatar(element) {
    if (this.attributeName === 'src') {
      element.setAttribute(this.attributeName, commons.AVATAR_URL)
    }
  }

  setName(element) {
    // sets the name to be displayed and the title of the html page
    if (this.attributeName === 'name' || this.attributeName === 'title') {
      element.setInnerContent(commons.NAME)
    }
  }

  changeBackground(element, attribute) {
    // changes the background color of the body
    if (attribute && this.attributeName === 'class') {
      element.setAttribute(
        this.attributeName,
        attribute.replace('bg-gray-900', 'bg-blue-900'),
      )
    }
  }

  async element(element) {
    const attribute = element.getAttribute(this.attributeName)
    this.displayProfile(element, attribute)
    this.setAvatar(element)
    this.setName(element)
    this.changeBackground(element, attribute)
  }
}

/**
 * Transformer class to trasnform the links into the hyperlink </a> format
 */
class LinksTransformer {
  constructor(links) {
    this.links = links
  }

  async element(element) {
    this.links.map(link => {
      const parsedLink = `<a href="${link.url}">${link.name}</a>`
      element.append(parsedLink, { html: true })
    })
  }
}

module.exports = {
  UserProfileTransformer,
  LinksTransformer,
}
