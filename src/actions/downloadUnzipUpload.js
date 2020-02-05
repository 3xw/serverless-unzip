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

  download = function()
  {
    return (dispatch, getState) =>
    {
      dispatch({ type: 'DOWNLOAD_START' })
    }
  },

  unzip = function()
  {
    return (dispatch, getState) =>
    {
      dispatch({ type: 'UNZIP_START' })

    }
  },

  deleteFolder = function()
  {
    return (dispatch, getState) =>
    {
      dispatch({ type: 'DELETE_START' })

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

  init = function()
  {
    return (dispatch, getState) =>
    {
      dispatch({ type: 'INIT_DOWNLAOD_UNZIP_UPLOAD' })
    }
  }

module.exports = init
