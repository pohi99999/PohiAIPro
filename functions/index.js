// index.js
const helloWorld = require('./helloWorld');
const fileUpload = require('./onFileUpload');

exports.helloWorld = helloWorld.helloWorld;
exports.processFileUpload = fileUpload.processFileUpload;
