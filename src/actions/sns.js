const
store = require('../stores/root.js'),
chalk = require('chalk'),
aws = require('aws-sdk'),
s3 = new aws.S3(),

sendTopic = function()
{
  return (dispatch, getState) =>
  {
    dispatch({ type: 'SNS_START' })

    sns.publish(
      params = {
        Message: getState().message,
        TopicArn: getState().topic
      },
      function(err, data)
      {
        if (err) throw err
        else dispatch({ type: 'SNS_SUCCESS' })
      }
    )
  }
}

module.exports = {sendTopic}
