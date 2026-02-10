import * as ElementTags from '../ElementTags/ElementTags.ts'

export const isSelfClosingTag = (tag: string): boolean => {
  switch (tag.toLowerCase()) {
    case 'area':
    case 'base':
    case 'col':
    case ElementTags.Br:
    case ElementTags.Hr:
    case ElementTags.Img:
    case ElementTags.Input:
    case 'embed':
    case 'link':
    case 'meta':
    case 'param':
    case 'source':
    case 'track':
    case 'wbr':
      return true
    default:
      return false
  }
}
