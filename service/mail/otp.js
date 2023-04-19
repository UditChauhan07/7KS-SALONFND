const request = require('request')
var smtpurl = 'https://api.smtp2go.com/v3/email/send'

var smtpob = (name, email, otp) => {
        return {
            'api_key': 'api-D86478DE963711ECBCEAF23C91BBF4A0',
            'to': [`${name} <${email}>`],
            'sender': 'notification@salonfinder.com',
            'subject': 'Welcome to Salon Finder',
            'html_body': `<p>Hi! ${name}</p><p>OTP: ${otp}</p>`,
        }
}

module.exports = function () {
  function send (name, username, user_token,typeId) {
    if(typeId == 1){
    var src = smtpob(name, username, user_token)

    request
          .post({
            headers: {'content-type': 'application/json'},
            url: smtpurl,
            body: JSON.stringify(src)
          })
          .on('response', function (response) {
            if (response.statusCode !== 200) {
              console.log(response.statusCode)
              console.log(response.statusMessage)
            }
          })
          .on('data', function (data) {
            console.log('decoded chunk: ' + data)
          })
          .on('error', function (err) {
            console.log('Email sender', err)
          })
        }else{
            //mobile verfication code
        }
  }
  return {send: send}
}