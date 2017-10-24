'use strict'

const tape = require('tape')
const cmz = require('../src')

tape('compose', function (t) {
  t.test('Empty atom', (t) => {
    const atom = cmz('')
    t.equal(
      atom,
      'cmz-0',
      'An atom with no rules still gets a name'
    )

    t.end()
  })

  t.test('Empty with composition', (t) => {
    const atom = cmz('aa', 'bb')
    t.equal(
      atom,
      'cmz-1 aa bb',
      'An atom with compositions but no rules still gets a name'
    )

    t.end()
  })

  t.test('Empty composition', (t) => {
    const atom = cmz(
      'color: blue',
      ''
    )

    t.equal(
      cmz.sheets[atom],
      `.${atom} {color: blue;}`,
      'Empty composition means no changes')

    t.end()
  })

  t.test('Single composition', (t) => {
    const atom = cmz(
      'overflow: hidden',
      'aa'
    )

    t.equal(
      atom,
      'cmz-3 aa',
      'Classes are added together')

    t.end()
  })

  t.test('Multiple composition', (t) => {
    const atom = cmz(`
    @media (min-width: 400) {
      & { color: blue }
    } `, 'aa', 'bb')

    t.equal(
      atom,
      'cmz-4 aa bb',
      'Classes are added together')

    t.end()
  })

  t.test('Nested composition', (t) => {
    const a1 = cmz(
      'color: green',
      'aa',
      'bb'
    )

    const a2 = cmz(
      'color: yellow',
      a1,
      'cc'
    )

    t.equal(
      a2,
      'cmz-6 cmz-5 aa bb cc',
      'Classes are added together')

    t.end()
  })

  t.test('Named atom with multiple rules', t => {
    const a = cmz.named('atom',
      'a: 1',
      '&:hover { c: 3 }',
      'b: 2'
    )

    t.equal(
      cmz.sheets[a],
      '.atom {a: 1;\nb: 2;}\n.atom:hover { c: 3; }'
    )

    t.end()
  })

  t.test('Keyframes', (t) => {
    const atom = cmz(`
& {
  animation: ? 1s infinite
}

@keyframes ? {
  0% { opacity: 1 }
  50% { opacity: 0 }
}`)

    t.equal(
      cmz.sheets[atom],
      `
.cmz-7 {
  animation: cmz-7 1s infinite;
}

@keyframes cmz-7 {
  0% { opacity: 1; }
  50% { opacity: 0; }
}`,
      'Placeholder for scoped keyframes')

    t.end()

  })
})
