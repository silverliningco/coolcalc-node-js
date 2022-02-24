const { Router } = require('express');
const router = Router();

const axios = require('axios');

// The URL for the MJ8 report at the CoolCalc API.
// MJ8 report ids are not guessable so they can be safely retrieved outside the normal UI flow.
const APIUrl = "https://stagingapi.coolcalc.com/staging/MJ8Reports/?reportId=";

// Enter your API credentials
const ClientId = '';
const APIKey = '';

// coolcalcAuthentication returns a Base64 encoded HTTP Basic authentication string.
const coolcalcAuthentication = function () {
    let encoded = Buffer.from(ClientId + ':' + APIKey).toString('base64');
    return encoded;
}

router.get('*', async (req, res) => {

    const reportId = req.params.reportId;

    // Get data from CoolCalc API.
    axios.get(`${APIUrl}${reportId}&rev=latest`, {
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

module.exports = router;