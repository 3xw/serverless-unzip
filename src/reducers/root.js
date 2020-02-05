const
  config = require('../../config/main.js'),
  chalk = require('chalk'),
  initialState =
  {
  },
  rootReducer = function(state = initialState, action)
  {
    // set action to giv the state a name
    state = Object.assign({}, state, { action: action})
    console.log(chalk.yellow(' - state action:',state.action.type))

    switch (action.type)
    {
      case 'INIT':
      let data = JSON.parse(action.event.Records[0].Sns.Message)
      if(!config.hasOwnProperty(data.project)) throw new Error({message: 'Project not found'})
      if(!config[data.project].profiles.hasOwnProperty(data.profile)) throw new Error({message: 'Profile not found'})

      return Object.assign({}, state, {})


      default:
      return state
    }
  }

module.exports = rootReducer
