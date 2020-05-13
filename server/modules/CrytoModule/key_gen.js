//WARNING if run this script by mistake all encrypted data with those keys will be losed forever
//If are'nt an available backup of the keys

//Built-in module for cryptography in Node
const crypto = require('crypto'); 
//Created with a safe randomValue coult be 16 bytes for performance
const key = crypto.randomBytes(32).toString('hex');
// It's like a second key that must be always of 16 bytes 
const iv = crypto.randomBytes(16).toString('hex'); 

//Saving it into .env file

const fs = require('fs');

const filePath = "./.env";
let file = 'CRYPTO_KEY='+key+"\nCRYPTO_IV="+iv;

fs.writeFile(filePath, file, function(err, response){
    if(err){
        console.log("Errow while saving key: \n"+err);
    }else{
        console.log("Key corrected saved");
    }
});