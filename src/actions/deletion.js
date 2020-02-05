const
  store = require('../stores/root.js'),
  chalk = require('chalk'),
  aws = require('aws-sdk'),
  s3 = new aws.S3(),

  deleteFile = function()
  {
    return (dispatch, getState) =>
    {
      dispatch({ type: 'DELETE_START' })

    }
  },

  emptyDirectory = function()
  {
    return (dispatch, getState) =>
    {
      dispatch({ type: 'EMPTY_DIRECTORY_START' })

    }
  },

  tick = function()
  {
    return (dispatch, getState) =>
    {
      dispatch({ type: 'DELETE_TICK' })

    }
  },

  init = function()
  {
    return (dispatch, getState) =>
    {
      dispatch({ type: 'INIT_DELETE' })
    }
  }

module.exports = init
