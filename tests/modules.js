const tape = require('tape')
const cmz = require('../index.js')

tape('modules', function (t) {
  t.test('composing atoms, names and rules', t => {
    const mod = cmz('Mod', {
      a: 'color: #F00'
    })

    mod.add({
      b: [
        mod.a,
        'color: #BAA'
      ]
    })

    mod.add({
      c: [
        mod.b,
        'globalName',
        'font-weight: bold'
      ]
    })

    t.equal(
      mod.c.toString(),
      `${mod.c.name} ${mod.b.name} ${mod.a.name} globalName`
    )

    t.end()
  })
})
