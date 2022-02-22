const { Router } = require('express');

const router = Router();
/* Implement your own code here, sample output is provided below.
* If user is logged in, respond with known account nr and individual user id.
* If user is not logged in, generate a random John-or-Jane-Doe id for the duration of the session.
* When a not logged in user becomes known, add a direct API call at the end of your login flow
* to update the identifying information for any work that the not logged in user may have done.
*/
router.get('/', function(req, res)  {

    const a = res.json({
        "userReference" : "nice-user",
        "dealerReference" :"nice-contractor",
        "isAdmin" : true
    });

    return a;
} );

module.exports = router ;