#!/usr/bin/env node
const
  cb = function(err, success)
  {
    console.log(success)
    process.exit(0)
  },
  {handler} = require('../index.js')

handler({
  "Records": [
    {
      "Sns": {
        "Message": "{\r\n\"src\": \"archives/1580893306_archive.zip\",\r\n\"dest\": \"modules/00\",\r\n\"project\": \"pocus\",\r\n\"profile\": \"default\"\r\n}",
      }
    }
  ]
},{}, cb)
