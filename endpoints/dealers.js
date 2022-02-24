
const { Router } = require('express');
const router = Router();
const axios = require('axios');

const api_domain = 'https://stagingapi.coolcalc.com';

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
const coolcalcAuthentication = function () {
    let encoded = Buffer.from(ClientId + ':' + APIKey).toString('base64');
    return encoded;
}

/**
 * This is the normal flow to call the CoolCalc API and forward its response to our client.
 * Whatever the original request was from the browser to our local server is repeated to the CoolCalc API
 * and the CoolCalc API's response is forwarded unchanged to the browser. 
 */
router.get('*', async (req, res) => {
    // To-do:
    // Implement your own code here to check that the accountNr in the URL /dealers/accountNr/.... 
    // corresponds to the current user/session info.
    // This is to prevent some dishonest user from accessing someone else's project list.
    // ...

    // If the account nr in the REST URL does not correspond to the session user, respond with a 401 "are you trying to hack me" code.
    // Remove URL segments specific to our local entry point.
    const myUrl = req.originalUrl;
    const newURL = myUrl.replace('/coolcalc/client', '');

    // Get data from CoolCalc API.  
    axios.get(`${api_domain}${newURL}`, {
        headers: {
            Authorization: `Basic ${coolcalcAuthentication()}`
        }
    }).then(response => {
        // Output to the browser.
        res.setHeader('Content-Type', response.headers['content-type']);
        res.setHeader('allow', response.headers['allow']);
        res.setHeader('Access-Control-Expose-Headers', 'Location, Allow');
        res.jsonp(response.data);

    }).catch(error => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            res.setHeader('Content-Type', error.response.headers['content-type']);
            return res.status(error.response.status).json(error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            res.json({
                error: error.request
            });
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
    });

});


router.post('*', raw, async (req, res) => {

    // Remove URL segments specific to our local entry point.
    const myUrl = req.originalUrl;
    const newURL = myUrl.replace('/coolcalc/client', '');

    res.setHeader('Access-Control-Expose-Headers', 'Location, Allow');

    axios.post(`${api_domain}${newURL}`, req.body, {
        headers: {
            Authorization: `Basic ${coolcalcAuthentication()}`
        }
    }).then(response => {
        // Output to the browser.
        res.setHeader('Content-Type', response.headers['content-type']);
        res.setHeader('allow', response.headers['allow']);
        res.setHeader('location', response.headers['location']);
        return res.status(response.status).json(response.data)
    }).catch(error => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            res.setHeader('Content-Type', error.response.headers['content-type']);
            return res.status(error.response.status).json(error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            res.json({
                error: error.request
            });
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
    });
});


router.put('*', raw, async (req, res) => {

    const myUrl = req.originalUrl;
    const newURL = myUrl.replace('/coolcalc/client', '');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Expose-Headers', 'Location, Allow');

    axios.put(`${api_domain}${newURL}`, req.body, {
        headers: {
            Authorization: `Basic ${coolcalcAuthentication()}`
        }
    }).then((response) => {
        // Output to the browser.
        res.setHeader('Content-Type', response.headers['content-type']);
        res.setHeader('allow', response.headers['allow']);
        return res.status(response.status).json(response.data)
    }).catch(error => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            res.setHeader('Content-Type', error.response.headers['content-type']);
            return res.status(error.response.status).json(error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            res.json({
                error: error.request
            });
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
    });
});

router.delete('*', (req, res) => {

    // Remove URL segments specific to our local entry point.
    const myUrl = req.originalUrl;
    const newURL = myUrl.replace('/coolcalc/client', '');

    // Make the request
    axios.delete(`${api_domain}${newURL}`, {
        headers: {
            Authorization: `Basic ${coolcalcAuthentication()}`
        }
    }).then(response => {
        res.sendStatus(204);
    }).catch(error => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            res.setHeader('Content-Type', error.response.headers['content-type']);
            return res.status(error.response.status).json(error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            res.json({
                error: error.request
            });
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
    });
});

module.exports = router;