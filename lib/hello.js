var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var request = require('request');

function helloRoute() {
  var hello = new express.Router();
  hello.use(cors());
  hello.use(bodyParser());


  // GET REST endpoint - query params may or may not be populated
  hello.get('/', function(req, res) {
    console.log(new Date(), 'In hello route GET / req.query=', req.query);
    var world = req.query && req.query.applicantName ? req.query.applicantName : 'get.. world';
    // see http://expressjs.com/4x/api.html#res.json
    res.json({msg: 'Hello ' + world});
  });

  // POST REST endpoint - note we use 'body-parser' middleware above to parse the request body in this route.
  // This can also be added in application.js
  // See: https://github.com/senchalabs/connect#middleware for a list of Express 4 middleware
  hello.post('/', function(req, res) {
    console.log(new Date(), 'In hello route POST / req.body=', req.body);
    var appl = req.body && req.body.applicantName ? req.body.applicantName : 'dummyAppl';
    var email = req.body && req.body.emailAddress ? req.body.emailAddress : 'dummyMail';
    var numberOfTravelers = req.body && req.body.numberOfTravelers ? req.body.numberOfTravelers : '1';
    var fromDestination = req.body && req.body.fromDestination ? req.body.fromDestination : 'Dubai';
    var toDestination = req.body && req.body.toDestination ? req.body.toDestination : 'Zurich';
    var dateOfArrival = req.body && req.body.dateOfArrival ? req.body.dateOfArrival : '2015-03-30';
    var dateOfDeparture = req.body && req.body.dateOfDeparture ? req.body.dateOfDeparture : '2015-04-07';

    var url = 'http://' + process.env.OSE_BPM_DOMAIN + '/external-client-ui-form-1.0/';
    url += 'SimpleServlet?applicantName='+appl;
    url += '&emailAddress='+email;
    url += '&numberOfTravelers='+numberOfTravelers;
    url += '&fromDestination='+fromDestination;
    url += '&toDestination='+toDestination;
    url += '&preferredDateOfArrival='+dateOfArrival;
    url += '&preferredDateOfDeparture='+dateOfDeparture+'&otherDetails=N%2FA';

    console.log('calling url: '+encodeURI(url));

request(encodeURI(url), function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body);
    var idx = body.indexOf("[");
    var endidx = body.indexOf("]");
    if(idx == -1){
      res.json({msg: 'Went wrong: ' + body});
    }else{
      res.json({msg: 'Process started: ' + body.substring(idx,endidx+1)});
    }
  } else if (error){
    res.json({msg: 'Went wrong: ' + error});
  } else{
    res.json({msg: 'Status code: ' + response.statusCode});
  }  

});
    // see http://expressjs.com/4x/api.html#res.json
    //res.json({msg: 'Hello ' + body.substring(1,5)});
  });

  return hello;
}

module.exports = helloRoute;
