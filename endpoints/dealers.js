
const { Router} = require('express');
const router = Router();
const got = require('got');

const api_domain='https://stagingapi.coolcalc.com';
// Enter your API credentials
const ClientId = '';
const APIKey = '';

//raw body (this is only necessary for post and put methods)
var bodyParser = require('body-parser');
const express = require('express');
const app = express();


var rawBodySaver = function (req, res, buf, encoding, next) {
    req.headers['content-type'] = 'application/json; charset=utf-8';
    if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
    }
}

const raw = app.use(bodyParser.raw({ coolcalcAuthentication: rawBodySaver, type: '*/*' }));

// coolcalcAuthentication returns a Base64 encoded HTTP Basic authentication string.
const coolcalcAuthentication = function(){
    let encoded = Buffer.from(ClientId + ':' + APIKey).toString('base64');
    return encoded;
}

/**
 * This is the normal flow to call the CoolCalc API and forward its response to our client.
 * Whatever the original request was from the browser to our local server is repeated to the CoolCalc API
 * and the CoolCalc API's response is forwarded unchanged to the browser. 
 */
router.get( '*', async(req, res) => {
	// To-do:
    // Implement your own code here to check that the accountNr in the URL /dealers/accountNr/.... 
    // corresponds to the current user/session info.
    // This is to prevent some dishonest user from accessing someone else's project list.
    // ...
    // If the account nr in the REST URL does not correspond to the session user, respond with a 401 "are you trying to hack me" code.
    // ...
    	
    // Remove URL segments specific to our local entry point.
   const myUrl = req.originalUrl;
   const newURL = myUrl.replace('/coolcalc/client', '' );

    // Get data from CoolCalc API.  
    var options = {
        'url': `${api_domain}${newURL}`,
        'headers': {
            'Authorization': `Basic ${coolcalcAuthentication()}`
        }
    };
    let response = await got.get(options);

    // Output to the browser.
    res.setHeader('Content-Type', response.headers['content-type']);
    res.setHeader('allow', response.headers['allow']);
    res.setHeader('Access-Control-Expose-Headers', 'Location, Allow');
    res.jsonp(JSON.parse(response.body));

} );


router.post( '*', raw,async (req, res) => {
	// To-do:
    // Implement your own code here to check that the accountNr in the URL /dealers/accountNr/.... 
    // corresponds to the current user/session info.
    // This is to prevent some dishonest user from accessing someone else's project list.
    // ...
    // If the account nr in the REST URL does not correspond to the session user, respond with a 401 "are you trying to hack me" code.
    // ...

    // Remove URL segments specific to our local entry point.
    const myUrl = req.originalUrl;
    const newURL = myUrl.replace('/coolcalc/client', '' );
    
    // Post data to CoolCalc API and read the response.
    var options = {
        'url': `${api_domain}${newURL}`,
        'headers': {
        'Authorization': `Basic ${coolcalcAuthentication()}`
            },
        'body':  `${req.body}`
    };
    res.setHeader('Access-Control-Expose-Headers', 'Location, Allow');

    // Make the request
    await  got.post(options).then((doc) => {
		// Output to the browser.
        res.setHeader('Content-Type', doc.headers['content-type']);
        res.setHeader('allow', doc.headers['allow']); 
        res.setHeader('location', doc.headers['location']); 
        return res.status(doc.statusCode).json(JSON.parse(doc.body));
    }).catch(err => {
        res.setHeader('Content-Type', err.response.headers['content-type']);
        return res.status(err.response.statusCode).json(JSON.parse(err.response.body));
    })
} );


router.put( '*', raw,async(req, res) => {
	// To-do:
    // Implement your own code here to check that the accountNr in the URL /dealers/accountNr/.... 
    // corresponds to the current user/session info.
    // This is to prevent some dishonest user from accessing someone else's project list.
    // ...
    // If the account nr in the REST URL does not correspond to the session user, respond with a 401 "are you trying to hack me" code.
    // ...

    // Remove URL segments specific to our local entry point.
    const myUrl = req.originalUrl;
    const newURL = myUrl.replace('/coolcalc/client', '' );
 
    // Post data to CoolCalc API and read the response.
     var options = {
         'url': `${api_domain}${newURL}`,
         'headers': {
             'Authorization': `Basic ${coolcalcAuthentication()}`
             },
             'body':  `${req.body}`
     };
  
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Expose-Headers', 'Location, Allow');

    // Make the request
    await  got.put(options).then((doc) => {
		// Output to the browser.
        res.setHeader('Content-Type', doc.headers['content-type']);
        res.setHeader('allow', doc.headers['allow']); 
        return res.status(doc.statusCode).json(JSON.parse(doc.body));
    }).catch(err => {
        res.setHeader('Content-Type', err.response.headers['content-type']);
        return res.status(err.response.statusCode).json(JSON.parse(err.response.body));
    })
});


router.delete( '*', (req, res) => {
	// To-do:
    // Implement your own code here to check that the accountNr in the URL /dealers/accountNr/.... 
    // corresponds to the current user/session info.
    // This is to prevent some dishonest user from accessing someone else's project list.
    // ...
    // If the account nr in the REST URL does not correspond to the session user, respond with a 401 "are you trying to hack me" code.
    // ...

    // Remove URL segments specific to our local entry point.
    const myUrl = req.originalUrl;
    const newURL = myUrl.replace('/coolcalc/client', '' );

    //sending the options to be able to make a new request
     var options = {
         'url': `${api_domain}${newURL}`,
         'headers': {
             'Authorization': `Basic ${coolcalcAuthentication()}`
        }
     };
  
    // Make the request
    try{
        got.delete(options);
        res.sendStatus(204);
    }
    catch (error) {
        res.setHeader('Content-Type', error.response.headers['content-type']);
        return res.status(error.response.statusCode).json(JSON.parse(error.response.body));
    }

} );

module.exports = router;