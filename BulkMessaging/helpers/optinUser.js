const axios = require("axios").default;
const { URLSearchParams } = require('url');

//checking if the user is already optin with the perticular app
exports.makeUserOptedin = async (phone, appName, apiKey) => {

  const encodedParams = new URLSearchParams();
  encodedParams.set('user', phone);

  const optionsForPost = {
    method: 'POST',
    url: `https://api.gupshup.io/sm/api/v1/app/opt/in/${appName}`,//endpoint for making the user a opin user
    headers: {
      apikey: apiKey,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: encodedParams,
  };

  axios.request(optionsForPost).then(function (response) {
    console.log(response.data);
  }).catch(function (error) {
    console.error(error);
  });
  return;
}
