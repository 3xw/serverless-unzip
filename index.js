'use strict'

const
  store = require('./src/stores/root.js'),
  initDownload = require('./src/actions/downloadUnzipUpload.js'),

  // app flow
  subscribtion = store.subscribe(() =>
  {
    switch(store.getState().action.type)
    {
      // 1
      case 'INIT': return store.dispatch(initDownload())
      // 2

      //store.getState().callback(null, store.getState())
    }
  })

module.exports.handler = (event, context, callback) =>
{
  // bootsrap app
  store.dispatch({type:'INIT', event, context, callback })
}
