const cmzTransform = require('../transform')
const tape = require('tape')
const browserify = require('browserify')
const fs = require('fs')
const path = require('path')

const casesDir = path.join(__dirname, 'cases')

// test cases are expected to have:
// - index.js (entry point)
// - expected.js (expected output)
fs.readdirSync(path.join(__dirname, 'cases')).forEach(runTestCase)

function runTestCase (dir) {
  tape('case: ' + dir, function (t) {
    t.plan(1)

    const caseDir = path.join(casesDir, dir)
    const b = browserify()

    b.add(path.join(caseDir, 'index.js'))
    b.transform(cmzTransform)

    b.bundle(function (err, buf) {
      if (err) {
        t.error(err, 'should not error')
        return
      }

      const actual = buf.toString('utf8')
      fs.writeFileSync(path.join(caseDir, 'actual.js'), buf)
      const expected = fs.readFileSync(path.join(caseDir, 'expected.js'), 'utf8')
      t.equal(actual, expected)
    })
  })
}
