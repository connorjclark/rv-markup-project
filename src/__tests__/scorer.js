/* eslint-env jest */

import scorer from '../scorer'

it('canary', () => {
  expect(1).toEqual(1)
})

it('basic', () => {
  expect(scorer('')).toEqual(0)
})
