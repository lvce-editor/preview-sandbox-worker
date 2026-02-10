/* eslint-disable @cspell/spellchecker */
// Common HTML attributes that are safe to allow by default
const commonAllowedAttributes = new Set([
  // Global attributes
  'id',
  'title',
  'tabindex',
  'class',
  'style',
  'lang',
  'dir',
  'hidden',
  'contenteditable',
  'draggable',
  'spellcheck',
  'translate',
  'role',

  // Form input attributes
  'disabled',
  'name',
  'type',
  'value',
  'placeholder',
  'required',
  'readonly',
  'checked',
  'autofocus',
  'autocomplete',
  'multiple',
  'accept',
  'min',
  'max',
  'step',
  'pattern',
  'maxlength',
  'minlength',
  'size',
  'rows',
  'cols',
  'wrap',
  'inputmode',

  // Form attributes
  'action',
  'method',
  'enctype',
  'target',
  'novalidate',
  'form',

  // Link attributes
  'href',
  'rel',
  'download',
  'hreflang',

  // Image attributes
  'src',
  'alt',
  'width',
  'height',
  'loading',
  'decoding',
  'crossorigin',
  'srcset',
  'sizes',

  // Media attributes
  'controls',
  'autoplay',
  'loop',
  'muted',
  'preload',
  'poster',

  // Table attributes
  'colspan',
  'rowspan',
  'headers',
  'scope',

  // List attributes
  'reversed',
  'start',

  // Other semantic attributes
  'open',
  'datetime',
  'cite',
  'for',
  'label',
])

export const isDefaultAllowedAttribute = (attributeName: string, defaultAllowedAttributes: readonly string[]): boolean => {
  // Allow data-* attributes
  if (attributeName.startsWith('data-')) {
    return true
  }
  // Allow aria-* attributes
  if (attributeName.startsWith('aria-')) {
    return true
  }
  // Check if it's a common HTML attribute
  if (commonAllowedAttributes.has(attributeName)) {
    return true
  }
  // Check if in default list
  return defaultAllowedAttributes.includes(attributeName)
}
