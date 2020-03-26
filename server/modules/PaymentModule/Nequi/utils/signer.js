/*
  This script file receives request options from another files and requests
  To Nequi Conecta API and return the information sended by the Nequi
  Services, actually provides new subscription, get subscription and
  Automatic payment features from Nequi API services.
*/
const https = require('https');
const aws4  = require('aws4');
require('dotenv').config({path:'.env'});
var awsSigner = {
    makeSignedRequest:makeSignedRequest
};

module.exports = awsSigner;

const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_KEY = process.env.SECRET_KEY;
const API_KEY = process.env.API_KEY;

/**
 * @description Funcion para hacer una petición al API de Nequi
 * @author jomgarci@bancolombia.com.co
 */
function makeSignedRequest(host, path, method, headers, body, onSuccess, onError){
    delete headers['X-Amz-Date'];
    delete headers['Host'];
    delete headers['Content-Length'];
    delete headers['Authorization'];
    headers['x-api-key'] = API_KEY;
    var options = {
      host: host,
      path: path,
      method: method,
      headers: headers,
      service: 'execute-api',
      body: JSON.stringify(body)
    };
    //This part of the code configures the request options and signs it with
    //custom aws4 signature module
    //ACCES_KEY_ SECRET_KEY and API_KEY are provide by Nequi Conecta API
    options = aws4.sign(options, {accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY});
    callback = function(response) {
        delete headers['X-Amz-Date'];
        delete headers['Host'];
        delete headers['Content-Length'];
        delete headers['Authorization'];
        delete headers['x-api-key'];
        var responseString = '';
        response.on('data', function(chunk)  {
            responseString += chunk;
        });

        response.on('end',  function()  {
            if(!!onSuccess){
                var r;
                try{
                    r = JSON.parse(responseString);
                }catch(e){
                    r = responseString;
                }
                onSuccess(response.statusCode, r, response);
            }
        });
    }

    var req = https.request(options, callback);
    if(!!body){
        req.write(JSON.stringify(body));
    }

    req.on('error', function(e)  {
        if(!!onError){
            onError(e);
        }
    });

    req.end();
}
