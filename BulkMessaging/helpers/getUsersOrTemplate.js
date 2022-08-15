const axios = require("axios").default;

//getting all the optin users of a perticular gupshup app
exports.allOtpedUsers = async (appName, apikey) => {

  let allUsers = [];

  const optionsForGet = {
    method: 'GET',
    url: `https://api.gupshup.io/sm/api/v1/users/${appName}`,//endpoint for getting the all users
    headers: {apikey: apikey}
  };

  await axios.request(optionsForGet).then(function (response) {
    allUsers = [...response.data.users];
  }).catch(function (error) {
    console.error(error);
  });

  //filtering out the non optin users
  const onlyOtpedinUsers = await allUsers.filter((user) => {
    return user.optinStatus === "OPT_IN"
  });

  return onlyOtpedinUsers;
}

//getting all the approved users for the perticular gupshup app
exports.allAprovedTemplates = async (appName, apikey) => {

  let allTemplates = [];

  const options = {
    method: 'GET',
    url: `https://api.gupshup.io/sm/api/v1/template/list/${appName}`,//endpoint for getting all the templates
    headers: {apikey: apikey}
  };

  await axios.request(options).then(function (response) {
    allTemplates = response.data.templates;
  }).catch(function (error) {
    console.error(error);
  });

  //filtering out the non approved and "app_template_notification" for the array of templates
  //"app_template_notification" is a tamplate used for sending the notification to the admin on new template request
  const allAprovedTemplates = await allTemplates.filter((template) => {
    return template.status === "APPROVED" && template.elementName !== "app_template_notification"
  });

  return allAprovedTemplates;
}
