const
store = require('../stores/root.js'),
chalk = require('chalk'),
aws = require('aws-sdk'),
s3 = new aws.S3(),

deleteSource = function()
{
  return (dispatch, getState) =>
  {
    dispatch({ type: 'DELETE_SOURCE_START' })

    let params = {
      Bucket: getState().bucket,
      Delete: {
        Objects:[
          getState().src
        ]
      }
    }

    s3.deleteObjects(
      params,
      function(err, data)
      {
        if (err) throw err
        dispatch({ type: 'DELETE_SOURCE_SUCCESS' })
      }
    )
  }
},

emptyDirectory = function()
{
  return (dispatch, getState) =>
  {
    dispatch({ type: 'DELETE_DESTINATION_START' })

    let params = {
      Bucket: getState().bucket,
      Delete: {
        Objects:[]
      }
    }

    getState().filesToDelete.forEach(function(content)
    {
      params.Delete.Objects.push({
        Key: content.Key
      })
    })

    s3.deleteObjects(
      params,
      function(err, data)
      {
        if (err) throw err
        if(getState().filesToDelete.length == 1000) dispatch({ type: 'TEST_DESTINATION'})
        else dispatch({ type: 'DESTINATION_OK' })
      }
    )
  }
}

module.exports = {emptyDirectory, deleteSource}
