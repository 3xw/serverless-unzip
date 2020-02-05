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
        "Message": "{\r\n\"id\": 1,\r\n\"project\": \"ofrou\",\r\n\"profile\": \"default\"\r\n}",
      }
    }
  ]
},{}, cb)
