const
  config = require('../../config/main.js'),
  chalk = require('chalk'),
  initialState =
  {
    dest: '',
    src: '',
    replaceDest: true,
    deleteSrc: false,
    bucket: '',
    tmpZipPath: '',
    filesToDelete: []
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

      // check config
      if(!config.hasOwnProperty(data.project)) throw new Error({message: 'Project not found'})
      if(!config[data.project].profiles.hasOwnProperty(data.profile)) throw new Error({message: 'Profile not found'})
      if(!data.src) throw new Error({message: 'No src file given'})

      // merge
      let
      profile = config[data.project].profiles[data.profile],
      merged = Object.assign({}, state, data),
      obj = {
        dest: profile.prefix? profile.prefix+'/'+merged.dest: merged.dest,
        src: profile.prefix? profile.prefix+'/'+merged.src: merged.src,
        replaceDest: merged.replaceDest,
        deleteSrc: merged.deleteSrc,
        bucket: profile.container
      }

      return Object.assign({}, state, obj)

      case 'DOWNLOAD_SUCCESS':
      return Object.assign({}, state, {tmpZipPath: state.action.tmpZipPath})

      case 'DESTINATION_EXISTS':
      return Object.assign({}, state, {filesToDelete: state.action.filesToDelete})

      default:
      return state
    }
  }

module.exports = rootReducer
