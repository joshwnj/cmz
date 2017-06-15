#!/usr/bin/env node

const fs = require('fs')

const filename = process.argv[2]
const raw = fs.readFileSync(filename, 'utf-8')

const output = raw.replace(/\/\*cmz\|[\w\W]*?\|cmz\*\//g, 'null')
console.log(output)
