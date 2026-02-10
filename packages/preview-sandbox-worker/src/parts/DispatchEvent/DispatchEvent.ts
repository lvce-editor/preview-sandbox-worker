export const dispatchEvent = (element: any, event: any): void => {
  element.dispatchEvent(event)

  // Also invoke direct on* handler if set (e.g. element.onclick = function(){})
  const handlerName = `on${event.type}`
  const handler = element[handlerName]

  if (typeof handler === 'function') {
    handler.call(element, event)
  } else if (handler === null || handler === undefined) {
    if (!element.getAttribute) {
      return
    }
    // Check if there's an inline HTML attribute that wasn't converted to a property
    const attrValue = element.getAttribute(handlerName)
    if (attrValue && typeof attrValue === 'string' && element.ownerDocument && element.ownerDocument.defaultView) {
      const window = element.ownerDocument.defaultView
      // Handle inline event handlers like onclick="someFunction(2)"
      // Evaluate in the context of the window so functions are in scope
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const fn = new Function('event', `with(this) { ${attrValue} }`)
      fn.call(window, event)
    }
  }
}
