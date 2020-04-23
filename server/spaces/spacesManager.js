require('dotenv').config({path:'.env'});
const AWS = require('aws-sdk');
const fs = require('fs');
const url = require('url');

const mainFolder = process.env.FILES_MAIN_FOLDER || "";
const bucket = 'data-timugo';
const spacesEndpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com');
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId : process.env.S3_ACCESS_KEY,
  secretAccessKey : process.env.S3_SECRET_KEY
});

var keyFile = undefined;

module.exports = {
  uploadFile : function(file, visibility){
    //Assing remote name according to
    var date = new Date();
    const remoteFile = file.substring(0, file.length-4)+date.toISOString().replace(/\W/g, '')
      +file.substring(file.length-4, file.length);

    keyFile = remoteFile;

    let acl = undefined;

    if(visibility=='PUBLIC'){
      acl = 'public-read';
    }

    let params = {
      Bucket : bucket,
      Body : fs.readFileSync(mainFolder+file),
      Key : remoteFile,
      ACL : acl
    }
    return s3.putObject(params).promise();
    //*/
  },
  deleteFile : function(remoteFilename){
    let params = {
      Bucket : bucket,
      Key : remoteFilename
    }
    return s3.deleteObject(params).promise();
  },
  getURLParams : function(){
    return s3.getSignedUrl('getObject', { Bucket: bucket, Key: keyFile});
  },
  getURL : function(){
    return 'https://data-timugo.nyc3.digitaloceanspaces.com/'+keyFile
  },
  getParams : function() {
    let urlString = s3.getSignedUrl('getObject', { Bucket: bucket, Key: keyFile});
    urlString = urlString.replace("https://data-timugo.nyc3.digitaloceanspaces.com", "");
    let query = url.parse(urlString, true).query;
    let params = {
      AWSAccessKeyId : query.AWSAccessKeyId,
      Expires : query.Expires,
      Signature : query.Signature
    }
    return params;
  },
  getRemoteFileName : function(){
    return keyFile;
  },
  setRemoteFileName : function(fileName){
    keyFile = fileName;
  }
};

//module.exports.uploadFile('hello-world.png', 'PRIVATE');
//module.exports.deleteFile('hello-world20200411T012928418Z.png');
//module.exports.getParams('hello-world20200411T020103161Z.png');
