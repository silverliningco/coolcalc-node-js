const express = require('express');
const cors = require('cors');
const https = require('https');
const path = require('path');
const fs = require('fs');

// create express server 
const app = express();

// configure CORS
app.use( cors() );

// routes
app.use( '/coolcalc/user', require('./endpoints/session_user'));
app.use( '/coolcalc/client',require('./endpoints/dealers'));
app.use( '/client/staging/MJ8Reports', require('./endpoints/mj8_report'));


const sslServer = https.createServer(
    {
      key: fs.readFileSync(path.join(__dirname, 'cert', 'selfsigned.key')),
      cert: fs.readFileSync(path.join(__dirname, 'cert', 'selfsigned.crt')),
    },
    app
  );
  
  sslServer.listen( 3000, () => {
    console.log('Secure Server on port 3000');
  });