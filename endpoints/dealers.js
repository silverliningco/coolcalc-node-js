
const { Router} = require('express');
const router = Router();
const axios = require('axios');

const api_domain='https://stagingapi.coolcalc.com';
// Enter your API credentials
const ClientId = 'DCNE';
const APIKey = 'letmein';

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

   const myUrl = req.originalUrl;
   const newURL = myUrl.replace('/coolcalc/client', '' );

    // Get data from CoolCalc API.  
    try {
        var response = await axios.get(`${api_domain}${newURL}`,  {
            headers:{
                Authorization: `Basic ${coolcalcAuthentication()}`
            }
        });
        // Output to the browser.
        res.setHeader('Content-Type', response.headers['content-type']);
        res.setHeader('allow', response.headers['allow']);
        res.setHeader('Access-Control-Expose-Headers', 'Location, Allow');
        res.jsonp(JSON.parse(response.body));
        

    } catch(err){
        res.json({
            error: err
        }); 
    }


} );


router.post( '*', raw,async (req, res) => {

    const myUrl = req.originalUrl;
    const newURL = myUrl.replace('/coolcalc/client', '' );

    res.setHeader('Access-Control-Expose-Headers', 'Location, Allow');

    try{
        await axios.post(`${api_domain}${newURL}`,  {
            headers:{
                Authorization: `Basic ${coolcalcAuthentication()}`
            },
            body: `${req.body}`
        }).then((doc) => {
            // Output to the browser.
            res.setHeader('Content-Type', doc.headers['content-type']);
            res.setHeader('allow', doc.headers['allow']); 
            res.setHeader('location', doc.headers['location']); 
            return res.status(doc.statusCode).json(JSON.parse(doc.body)) });
    } catch (err) {
        res.setHeader('Content-Type', err.response.headers['content-type']);
        return res.status(err.response.statusCode).json(JSON.parse(err.response.body));
    }
} );


router.put( '*', raw,async(req, res) => {

    const myUrl = req.originalUrl;
    const newURL = myUrl.replace('/coolcalc/client', '' );
 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Expose-Headers', 'Location, Allow');

    try{
        await axios.put(`${api_domain}${newURL}`,  {
            headers:{
                Authorization: `Basic ${coolcalcAuthentication()}`
            },
            body: `${req.body}`
        }).then((doc) => {
            // Output to the browser.
        res.setHeader('Content-Type', doc.headers['content-type']);
        res.setHeader('allow', doc.headers['allow']); 
        return res.status(doc.statusCode).json(JSON.parse(doc.body))});
    } catch (err) {
        res.setHeader('Content-Type', err.response.headers['content-type']);
        return res.status(err.response.statusCode).json(JSON.parse(err.response.body));
    }
});


router.delete( '*', (req, res) => {

    // Remove URL segments specific to our local entry point.
    const myUrl = req.originalUrl;
    const newURL = myUrl.replace('/coolcalc/client', '' );
  
    // Make the request
    try{
        axios.delete(`${api_domain}${newURL}`,  {
            headers:{
                Authorization: `Basic ${coolcalcAuthentication()}`
            }
        })
        res.sendStatus(204);
    }
    catch (error) {
        res.setHeader('Content-Type', error.response.headers['content-type']);
        return res.status(error.response.statusCode).json(JSON.parse(error.response.body));
    }

} );

module.exports = router;