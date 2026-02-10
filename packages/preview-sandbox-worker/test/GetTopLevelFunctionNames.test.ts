import { expect, test } from '@jest/globals'
import * as GetTopLevelFunctionNames from '../src/parts/GetTopLevelFunctionNames/GetTopLevelFunctionNames.ts'

test('getTopLevelFunctionNames - empty script', () => {
  expect(GetTopLevelFunctionNames.getTopLevelFunctionNames('')).toEqual([])
})

test('getTopLevelFunctionNames - single function declaration', () => {
  expect(GetTopLevelFunctionNames.getTopLevelFunctionNames('function hello() {}')).toEqual(['hello'])
})

test('getTopLevelFunctionNames - multiple function declarations', () => {
  const script = `function foo() {}
function bar() {}`
  expect(GetTopLevelFunctionNames.getTopLevelFunctionNames(script)).toEqual(['foo', 'bar'])
})

test('getTopLevelFunctionNames - function with underscore name', () => {
  expect(GetTopLevelFunctionNames.getTopLevelFunctionNames('function _private() {}')).toEqual(['_private'])
})

test('getTopLevelFunctionNames - function with dollar sign name', () => {
  expect(GetTopLevelFunctionNames.getTopLevelFunctionNames('function $helper() {}')).toEqual(['$helper'])
})

test('getTopLevelFunctionNames - function after semicolon', () => {
  expect(GetTopLevelFunctionNames.getTopLevelFunctionNames('var x = 1; function test() {}')).toEqual(['test'])
})

test('getTopLevelFunctionNames - no function declarations', () => {
  expect(GetTopLevelFunctionNames.getTopLevelFunctionNames('var x = 1; var y = 2;')).toEqual([])
})

test('getTopLevelFunctionNames - arrow function is not matched', () => {
  expect(GetTopLevelFunctionNames.getTopLevelFunctionNames('const fn = () => {}')).toEqual([])
})

test('getTopLevelFunctionNames - function expression is not matched', () => {
  expect(GetTopLevelFunctionNames.getTopLevelFunctionNames('const fn = function() {}')).toEqual([])
})

test('getTopLevelFunctionNames - function with body content', () => {
  const script = `function greet() {
  return "hello";
}`
  expect(GetTopLevelFunctionNames.getTopLevelFunctionNames(script)).toEqual(['greet'])
})

test('getTopLevelFunctionNames - functions separated by newlines', () => {
  const script = `function a() {}

function b() {}

function c() {}`
  expect(GetTopLevelFunctionNames.getTopLevelFunctionNames(script)).toEqual(['a', 'b', 'c'])
})

test('getTopLevelFunctionNames - nested function should not be included', () => {
  const script = `function outer() {
  function inner() {}
}`
  expect(GetTopLevelFunctionNames.getTopLevelFunctionNames(script)).toEqual(['outer'])
})

test('getTopLevelFunctionNames - multiple nested functions', () => {
  const script = `function outer() {
  function inner1() {}
  function inner2() {}
}
function topLevel() {}`
  expect(GetTopLevelFunctionNames.getTopLevelFunctionNames(script)).toEqual(['outer', 'topLevel'])
})

test('getTopLevelFunctionNames - deeply nested functions', () => {
  const script = `function a() {
  function b() {
    function c() {}
  }
}
function d() {}`
  expect(GetTopLevelFunctionNames.getTopLevelFunctionNames(script)).toEqual(['a', 'd'])
})
