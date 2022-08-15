const axios = require("axios").default;
const { URLSearchParams } = require('url');

//checking if the user is already optin with the perticular app
exports.otpedinUser = async (dial_code, phone, managerDel) => {

  let optedinUsers = [];

  const optionsForGet = {
    method: 'GET',
    url: `https://api.gupshup.io/sm/api/v1/users/${managerDel.appName}`,//endpoint for getting all the optin users
    headers: {apikey: managerDel.apiKey}
  };

  await axios.request(optionsForGet).then(function (response) {
    optedinUsers = [...response.data.users];
  }).catch(function (error) {
    console.error(error);
  });

  //checking is the dial_code is already in the array of optin users
  for(let user of optedinUsers){
    if(user.phoneCode === dial_code && user.optinStatus === "OPT_IN"){
      console.log("User Alread Otpedin");
      return;//returing if this condition is true
    }
  }


  //if user not alrady an optin users, then making him/her the optin user
  const encodedParams = new URLSearchParams();
  encodedParams.set('user', phone);

  const optionsForPost = {
    method: 'POST',
    url: `https://api.gupshup.io/sm/api/v1/app/opt/in/${managerDel.appName}`,//endpoint for making the user a opin user
    headers: {
      apikey: managerDel.apiKey,
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
