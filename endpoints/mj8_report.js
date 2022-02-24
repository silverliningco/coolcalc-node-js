const { Router} = require('express');
const router = Router();

const axios = require('axios');

// The URL for the MJ8 report at the CoolCalc API.
// MJ8 report ids are not guessable so they can be safely retrieved outside the normal UI flow.
const APIUrl = "https://stagingapi.coolcalc.com/staging/MJ8Reports/?reportId=";

// Enter your API credentials
const ClientId = '111';
const APIKey = '1626443386';

// coolcalcAuthentication returns a Base64 encoded HTTP Basic authentication string.
const coolcalcAuthentication = function(){
    let encoded = Buffer.from(ClientId + ':' + APIKey).toString('base64');
    return encoded;
}

router.get( '*', async(req, res) => {

    const reportId = req.params.reportId;   

    // Get data from CoolCalc API.
   /* var options = {
        'method': 'GET',
        'url': `${APIUrl}${reportId}&rev=latest`,
        'headers': {
            'Authorization': `Basic ${coolcalcAuthentication()}`
            }
    }; */

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
        res.jsonp(response.data);

    } catch(err){
        res.json({
            error: err
        }); 
    }

    

} );



module.exports = router;