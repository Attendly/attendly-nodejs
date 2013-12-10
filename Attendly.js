/**
 * @module Attendly
 * @requires https
 * Attendly API for Node.js
 * Tested on Node v0.10.22
 * 10-Dic-2013
 */

var https = require('https');
/**
 * @property m_apiKey
 * API authentication key
 * @type {String}
 */
var m_apiKey = '';

/**
 * @class Attendly
 * @constructor
 * Attendly class constructor
 * @param {String} apiKey API key
 */
function Attendly(apiKey)
{
  m_apiKey = apiKey;
}

/**
 * @method setAPIKey
 * Sets the API key value
 * @param {String} apiKey API key
 */
Attendly.prototype.setAPIKey = function(apiKey)
{
  m_apiKey = apiKey;
};

/**
 * @method userLogin
 * Authenticates the user
 * @param  {String}   name     User name
 * @param  {String}   password Password
 * @param  {Function} callback Callback function to process the response
 * @return {Array}             Returns the server response including the API Key
 */
Attendly.prototype.userLogin = function(name,password,callback)
{
  try
  {
    sendRequest("user.login",{user:
                              {name:name,
                              password:password
                              }
                            },callback);
  }
  catch (err)
  {
    callback(err, null);
  }
};

/**
 * @method eventList
 * List all the events of the authenticated user
 * @param  {Function} callback Callback function to process the response
 * @return {Array}            List of the user's events
 */
Attendly.prototype.eventList = function(callback)
{
  try
  {
    sendRequest("event.list",[],callback);
  }
  catch (err)
  {
    callback(err, null);
  }
};

/**
 * @method eventGet
 * Get an event by its id
 * @param  {String}   id       Event's identification
 * @param  {Function} callback Callback function to process the response
 * @return {Array}            Event information
 */
Attendly.prototype.eventGet = function(id,callback)
{
  try
  {
    sendRequest("event.get",{event:
                              {id:id
                              }
                            },callback);
  }
  catch (err)
  {
    callback(err, null);
  }
};

/**
 * @method sendRequest
 * @private
 * Private method to send a request to the server and receive its response
 * @param  {String}   method_name Name of the server method we want to call
 * @param  {Array}   params      Method parameters
 * @param  {Function} callback    Callback function to process the response
 * @return {Array}               Response data
 */
function sendRequest(method_name,params,callback)
{
  try
  {
    console.log(method_name,' request started.');

    // Build the post string from an object
    var post_data = JSON.stringify({jsonrpc:"2.0",
                          method:method_name,
                          id:new Date().getTime(),
                          params:params
                          });

    // An object of options to indicate where to post to
    var post_options =
    {
      host: 'attendly.me',
      port: '443',
      path: '/api/v4/',
      method: 'POST',
      auth: m_apiKey+':',
      headers:
      {
        'Content-Type' : 'application/json',
        'Content-Length': post_data.length
      }
    };

    // Set up the request
    var post_req = https.request(post_options, function(res)
    {
      //Uncomment if you want to print the headers to check for error
      //console.log('STATUS: ' + res.statusCode);
      //console.log('HEADERS: ' + JSON.stringify(res.headers));

      //Handle the response
      res.setEncoding('utf8');
      res.on('data', function (resp)
        {
          //Uncomment if you want to print the response as received from the server
          //console.log(resp);

          var data = JSON.parse(resp);
          console.log(method_name,' request finished.');
          var errorMessage = null;

          //Send an error if there is an error from the server.
          if('undefined' != typeof(data['error']))
          {
            errorMessage = 'Server Message: ';
            errorMessage = errorMessage.concat(data['error']['message']);
          }

            //Call to the user defined function
            callback(errorMessage, data);
        });
    });

    // post the data
    post_req.write(post_data);
    post_req.end();

    //Uncomment if you want to print what its being sent to the server
    //console.log(post_data);

  }
  catch(err)
  {
    throw err;
  }
}

//Expose the class to the user
exports.Attendly = Attendly;