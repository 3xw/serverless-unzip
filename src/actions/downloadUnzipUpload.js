const
store = require('../stores/root.js'),
chalk = require('chalk'),
AdmZip = require('adm-zip'),
aws = require('aws-sdk'),
dateTime = require('date-time'),
md5 = require('md5'),
mime = require('mime-types'),
s3 = new aws.S3(),
fs = require('fs'),

unzip = function()
{
  return (dispatch, getState) =>
  {
    dispatch({ type: 'UNZIP_START' })

  }
},

upload = function()
{
  return (dispatch, getState) =>
  {
    dispatch({ type: 'UNZIP_START' })

  }
},

tick = function()
{
  return (dispatch, getState) =>
  {
    dispatch({ type: 'UPLOAD_TICK' })

  }
},

testDestination = function()
{
  return (dispatch, getState) =>
  {
    dispatch({ type: 'TEST_UPLOAD_DESTINATION' })

    s3.listObjects(
      {
        Bucket: getState().bucket,
        Prefix: getState().dest
      },
      function(err, data)
      {
        if(err || data.Contents.length == 0)
        {
          dispatch({ type: 'DESTINATION_OK'})
          return dispatch(tick())
        }

        // destination exists
        dispatch({ type: 'DESTINATION_EXISTS', filesToDelete: data.Contents })

        if(!getState().replaceDest) throw new Error({message: 'Destination exists, replaceDest is set to false: -> execution abortion.'})
        else dispatch({ type: 'DELETE_DESTINATION' })
      }
    )
  }
},

download = function()
{
  return (dispatch, getState) =>
  {
    dispatch({ type: 'DOWNLOAD_START' })

    s3.getObject(
      {
        Bucket: getState().bucket,
        Key: getState().src
      },
      function(err, data)
      {
        if(err) throw new Error({message: 'Source does NOT exists: -> execution abortion.'})

        let
        tmpZipFilename = md5(dateTime({showMilliseconds: true})),
        tmpZipPath = '/tmp/'+tmpZipFilename+'.zip'

        // write file
        fs.writeFileSync(tmpZipPath, data.Body)

        // tell it's ok
        dispatch({ type: 'DOWNLOAD_SUCCESS', tmpZipPath })

        // test destination
        return dispatch(testDestination())
      }
    )
  }
}

module.exports = download
