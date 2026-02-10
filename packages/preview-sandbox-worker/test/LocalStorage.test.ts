import { expect, test } from '@jest/globals'
import { createLocalStorage } from '../src/parts/LocalStorage/LocalStorage.ts'

test('getItem - returns null for non-existent key', () => {
  const storage = createLocalStorage()
  expect(storage.getItem('missing')).toBe(null)
})

test('setItem and getItem - stores and retrieves a value', () => {
  const storage = createLocalStorage()
  storage.setItem('key', 'value')
  expect(storage.getItem('key')).toBe('value')
})

test('setItem - overwrites existing value', () => {
  const storage = createLocalStorage()
  storage.setItem('key', 'first')
  storage.setItem('key', 'second')
  expect(storage.getItem('key')).toBe('second')
})

test('setItem - converts value to string', () => {
  const storage = createLocalStorage()
  // @ts-ignore
  storage.setItem('num', 42)
  expect(storage.getItem('num')).toBe('42')
})

test('setItem - stores empty string', () => {
  const storage = createLocalStorage()
  storage.setItem('empty', '')
  expect(storage.getItem('empty')).toBe('')
})

test('removeItem - removes an existing key', () => {
  const storage = createLocalStorage()
  storage.setItem('key', 'value')
  storage.removeItem('key')
  expect(storage.getItem('key')).toBe(null)
})

test('removeItem - does nothing for non-existent key', () => {
  const storage = createLocalStorage()
  storage.removeItem('missing')
  expect(storage.length).toBe(0)
})

test('clear - removes all items', () => {
  const storage = createLocalStorage()
  storage.setItem('a', '1')
  storage.setItem('b', '2')
  storage.setItem('c', '3')
  storage.clear()
  expect(storage.length).toBe(0)
  expect(storage.getItem('a')).toBe(null)
  expect(storage.getItem('b')).toBe(null)
  expect(storage.getItem('c')).toBe(null)
})

test('clear - works on empty storage', () => {
  const storage = createLocalStorage()
  storage.clear()
  expect(storage.length).toBe(0)
})

test('length - returns 0 for empty storage', () => {
  const storage = createLocalStorage()
  expect(storage.length).toBe(0)
})

test('length - returns correct count after setItem', () => {
  const storage = createLocalStorage()
  storage.setItem('a', '1')
  storage.setItem('b', '2')
  expect(storage.length).toBe(2)
})

test('length - decreases after removeItem', () => {
  const storage = createLocalStorage()
  storage.setItem('a', '1')
  storage.setItem('b', '2')
  storage.removeItem('a')
  expect(storage.length).toBe(1)
})

test('length - does not increase when overwriting', () => {
  const storage = createLocalStorage()
  storage.setItem('key', 'first')
  storage.setItem('key', 'second')
  expect(storage.length).toBe(1)
})

test('key - returns key at given index', () => {
  const storage = createLocalStorage()
  storage.setItem('a', '1')
  expect(storage.key(0)).toBe('a')
})

test('key - returns null for negative index', () => {
  const storage = createLocalStorage()
  storage.setItem('a', '1')
  expect(storage.key(-1)).toBe(null)
})

test('key - returns null for index equal to length', () => {
  const storage = createLocalStorage()
  storage.setItem('a', '1')
  expect(storage.key(1)).toBe(null)
})

test('key - returns null for index greater than length', () => {
  const storage = createLocalStorage()
  storage.setItem('a', '1')
  expect(storage.key(5)).toBe(null)
})

test('key - returns null for empty storage', () => {
  const storage = createLocalStorage()
  expect(storage.key(0)).toBe(null)
})

test('key - returns keys in insertion order', () => {
  const storage = createLocalStorage()
  storage.setItem('b', '2')
  storage.setItem('a', '1')
  storage.setItem('c', '3')
  expect(storage.key(0)).toBe('b')
  expect(storage.key(1)).toBe('a')
  expect(storage.key(2)).toBe('c')
})

test('multiple operations - set, get, remove, get', () => {
  const storage = createLocalStorage()
  storage.setItem('key', 'value')
  expect(storage.getItem('key')).toBe('value')
  storage.removeItem('key')
  expect(storage.getItem('key')).toBe(null)
})

test('multiple operations - set multiple, clear, verify empty', () => {
  const storage = createLocalStorage()
  storage.setItem('x', '1')
  storage.setItem('y', '2')
  storage.setItem('z', '3')
  expect(storage.length).toBe(3)
  storage.clear()
  expect(storage.length).toBe(0)
  expect(storage.key(0)).toBe(null)
})

test('separate instances are independent', () => {
  const storage1 = createLocalStorage()
  const storage2 = createLocalStorage()
  storage1.setItem('key', 'value1')
  storage2.setItem('key', 'value2')
  expect(storage1.getItem('key')).toBe('value1')
  expect(storage2.getItem('key')).toBe('value2')
})

test('setItem - handles special characters in key', () => {
  const storage = createLocalStorage()
  storage.setItem('key with spaces', 'value')
  expect(storage.getItem('key with spaces')).toBe('value')
})

test('setItem - handles special characters in value', () => {
  const storage = createLocalStorage()
  storage.setItem('key', 'value\nwith\nnewlines')
  expect(storage.getItem('key')).toBe('value\nwith\nnewlines')
})

test('setItem - handles unicode characters', () => {
  const storage = createLocalStorage()
  storage.setItem('emoji', '😀🎉')
  expect(storage.getItem('emoji')).toBe('😀🎉')
})

test('setItem - handles very long values', () => {
  const storage = createLocalStorage()
  const longValue = 'a'.repeat(10_000)
  storage.setItem('long', longValue)
  expect(storage.getItem('long')).toBe(longValue)
})

test('setItem - handles JSON string values', () => {
  const storage = createLocalStorage()
  const json = JSON.stringify({ name: 'test', value: 42 })
  storage.setItem('data', json)
  expect(JSON.parse(storage.getItem('data') as string)).toEqual({ name: 'test', value: 42 })
})

test('getItem - returns null not undefined for missing keys', () => {
  const storage = createLocalStorage()
  const result = storage.getItem('nonexistent')
  expect(result).toBe(null)
  expect(result).not.toBe(undefined)
})

test('removeItem - after clear does nothing', () => {
  const storage = createLocalStorage()
  storage.setItem('key', 'value')
  storage.clear()
  storage.removeItem('key')
  expect(storage.length).toBe(0)
})

test('key - after removing first item', () => {
  const storage = createLocalStorage()
  storage.setItem('a', '1')
  storage.setItem('b', '2')
  storage.removeItem('a')
  expect(storage.key(0)).toBe('b')
  expect(storage.key(1)).toBe(null)
})

test('setItem - boolean value is converted to string', () => {
  const storage = createLocalStorage()
  // @ts-ignore
  storage.setItem('bool', true)
  expect(storage.getItem('bool')).toBe('true')
})

test('setItem - null value is converted to string', () => {
  const storage = createLocalStorage()
  // @ts-ignore
  storage.setItem('null', null)
  expect(storage.getItem('null')).toBe('null')
})

test('setItem - undefined value is converted to string', () => {
  const storage = createLocalStorage()
  // @ts-ignore
  storage.setItem('undef', undefined)
  expect(storage.getItem('undef')).toBe('undefined')
})
