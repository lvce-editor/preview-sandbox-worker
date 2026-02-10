export const parseText = (text: string): string => {
  return text.replaceAll('&gt;', '>').replaceAll('&lt;', '<').replaceAll('&amp;', '&')
}
