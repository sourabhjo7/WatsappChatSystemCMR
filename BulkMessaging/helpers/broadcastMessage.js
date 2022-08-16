const axios = require("axios").default;
const { URLSearchParams } = require('url');

exports.broadcastMessage = (message, destination, appNumber, appName, apiKey) => {

  //sending the message to the perticular destination for which it belong
  const encodedParams = new URLSearchParams();
  encodedParams.set('message', message);
  encodedParams.set('channel', 'whatsapp');
  encodedParams.set('source', appNumber);
  encodedParams.set('destination', destination);
  encodedParams.set('src.name', appName);
  encodedParams.set('disablePreview', 'false');

  const options = {
    method: 'POST',
    url: 'https://api.gupshup.io/sm/api/v1/msg',//endpoint for sending messages
    headers: {
      Accept: 'application/json',
      apikey: apiKey,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: encodedParams,
  };

  axios.request(options).then(function (response) {
    console.log("Message Sent");
  }).catch(function (error) {
    console.error(error);
  });
}
