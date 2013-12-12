/**
 * @module indexSimple
 * @requires express
 * @requires Attendly
 */

//We need to install express to easily emulate a server
var express = require('express');

//We import our API
var attendlyAPI = require('./Attendly');

//Instantiate our server
var app = express();

//Set and initialize out API class with its API key
var apiKey = 'YOUR API KEY GOES HERE!!!';
var attendly = new attendlyAPI.Attendly(apiKey);

//We set the server options, we will use Jade as web template engine
app.set('views',__dirname + '/views');
app.set('view engine', 'jade');
app.set('views',__dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());

app.get('/', function(req, res) {
    //Call to the function that will get the list of events
    attendly.eventList(eventListCallback);
    function eventListCallback(err, data)
        {
            if(null === err)
        {
            console.log('Events response: ' + data['result'].length + ' events.');
            if(data['result'].length > 0)
            {
                //If we got some result, we render them at the ListEvents page
                res.render('ListEvents',{title : 'Event List',
                                    events : data['result']
                            });
                res.end();
            }
            else
            {
                //If we got an empty array, we inform the user with an error message.
                var customError = new Error('You do not have any events to list. Lest create some!');
                console.log ('[User_side]', customError);
                res.render('ErrorPage', {error : customError});
                res.end();
            }
        }
        else
        {
            //In the case of an error, we present it to the user.
            console.log ('[User_side]', err);
            res.render('ErrorPage', {error : err});
            res.end();
        }
        }
});

//Start our server, for this example we are using port 8888
app.listen(8888, function() {
  console.log('Server running at http://127.0.0.1:8888/');
});