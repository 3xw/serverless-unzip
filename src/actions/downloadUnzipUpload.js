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

upload = function(zipEntry)
{
  return (dispatch, getState) =>
  {
    if(zipEntry.entryName.lastIndexOf('__MACOSX') != -1) return dispatch({ type: 'UPLOAD_SKIP', filename: zipEntry.entryName })

    dispatch({ type: 'UPLOAD_START', filename: zipEntry.entryName })

    let
    src = zipEntry.entryName,
    path = src.substring(src.indexOf('/') + 1)

    s3.upload(
      {
        Bucket: getState().bucket,
        Key: getState().dest+'/'+path,
        Body: zipEntry.getData()
      },
      function(err, data)
      {
        if(err) throw err
        dispatch({ type: 'UPLOAD_SUCCESS', filename: zipEntry.entryName })
      }
    )
  }
},

tick = function()
{
  return (dispatch, getState) =>
  {
    dispatch({ type: 'TICK' })
    if(getState().zipEntries.length == 0)
    {
      fs.unlinkSync(getState().tmpZipPath)
      return dispatch({ type: 'UPLOAD_FINISHED'})
    }

    dispatch(upload(getState().zipEntries.shift()))
  }
},

readzip = function()
{
  return (dispatch, getState) =>
  {
    dispatch({ type: 'ZIP_READ_START' })

    // archive reader
    let zip = new AdmZip(getState().tmpZipPath)

    // chek content
    if (zip.getEntries().length === 0)
    {
      fs.unlinkSync(getState().tmpZipPath)
      dispatch({ type: 'UNZIP_EMPTY_FILE' })
      throw new Error({message: 'Empty zip file'})
    }

    dispatch({ type: 'ZIP_READ_SUCCESS',  zipEntries: zip.getEntries()})
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
        if(err || data.Contents.length == 0) return dispatch({ type: 'DESTINATION_OK'})

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

        //check that file in that location is a zip content type, otherwise throw error and exit
       	if (mime.lookup(tmpZipPath) !== 'application/zip')
        {
          // delete file
          fs.unlinkSync(tmpZipPath)
          dispatch({ type: 'DOWNLOAD_WRONG_FILE_TYPE' })
          throw new Error({message: 'File is not a zip'})
       	}

        // tell it's ok
        dispatch({ type: 'DOWNLOAD_SUCCESS', tmpZipPath })
      }
    )
  }
}

module.exports = {download, testDestination, readzip, tick}
