require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

require('cmz').upsertCss('tests/cases/01-simple/index.css', `.tests_cases_01-simple_index__root {
  color: #F00;
}
`)
module.exports = {"root":"tests_cases_01-simple_index__root"}

},{"cmz":"cmz"}],2:[function(require,module,exports){
const cmz = require('cmz')
const styles = (function () {
  var tokens = require('/Users/josh/projects/css-modules/cmz/tests/cases/01-simple/index.css')
  return tokens
}())
module.exports = `<div class="${styles.root}">...</div>`

},{"/Users/josh/projects/css-modules/cmz/tests/cases/01-simple/index.css":1,"cmz":"cmz"}]},{},[2]);
