const
  { createStore, applyMiddleware } = require('redux'),
  thunk = require('redux-thunk').default,
  rootReducer = require('../reducers/root.js'),
  store = createStore(rootReducer, applyMiddleware(thunk))

module.exports = store
