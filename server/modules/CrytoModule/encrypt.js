require('dotenv').config({path:'.env'}); //requiring environment info as keys
const key=process.env.CRYPTO_KEY; //The key of the algorithm
const iv = process.env.CRYPTO_IV; //Another 'key' needed for AES_256 Algorithm

const crypto = require('crypto'); //Built-in module for cryptography
const algorithm = 'aes-256-cbc';  //The strongest algorithm for symmetric cryptography algorithm

//To encrypt just call .encrypt function and pass the string to be encrypted
//To decrypt just call .decrypt function and pass the encrypted string to get plain original text

module.exports = {
    encrypt : function(text){
        //setting up the cipher
        let cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
        //fit the cipher with the text to be encrypted
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        //returning the encrypted string (first converted into string because of the cipher return bytearray type)
        return  encrypted.toString('hex');
    },
    decrypt : function(text){
        //Reading the encrypted string and converting it into bytearray (the type needed in decipher)
        let encryptedText = Buffer.from(text, 'hex');
        //Setting up the decipher with the right algorithm and credentials
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
        //fit decipher with the bytearray of the encrypted string and returning the plain text of that
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}