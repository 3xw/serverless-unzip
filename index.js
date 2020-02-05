'use strict'

const
  store = require('./src/stores/root.js'),
  {download, testDestination, readzip, tick} = require('./src/actions/downloadUnzipUpload.js'),
  {emptyDirectory, deleteSource} = require('./src/actions/deletion.js'),
  {sendTopic} = require('./src/actions/sns.js'),

  // app flow
  subscribtion = store.subscribe(() =>
  {
    switch(store.getState().action.type)
    {
      // 1
      case 'INIT': return store.dispatch(download())
      // 2
      case 'DOWNLOAD_SUCCESS':
      case 'TEST_DESTINATION': return store.dispatch(testDestination())
      // 3
      case 'DELETE_DESTINATION': return store.dispatch(emptyDirectory())
      // 4
      case 'DESTINATION_OK': return store.dispatch(readzip())
      // 5
      case 'ZIP_READ_SUCCESS':
      case 'UPLOAD_SKIP':
      case 'UPLOAD_SUCCESS': return store.dispatch(tick())
      // 6
      case 'UPLOAD_FINISHED':
      if(store.getState().deleteSrc) return store.dispatch(deleteSource())

      case 'DELETE_SOURCE_SUCCESS':
      if(store.getState().topic && store.getState().message) return store.dispatch(sendTopic())

      case 'SNS_SUCCESS':
      process.exit(0)
    }
  })

module.exports.handler = (event, context, callback) =>
{
  // bootsrap app
  store.dispatch({type:'INIT', event, context, callback })
}
