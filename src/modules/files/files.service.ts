import { Injectable } from '@nestjs/common';
require('dotenv').config();
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
@Injectable()
export class FilesService {
  /* Class properties */
  /* file url */
  private keyFile:string = undefined;
  

  /* Class functions */
  /*
    This function must be called before any other
    set the key file propertie 
  */
  setRemoteFileName(fileName : string){
    this.keyFile = fileName;
  }
  /*
    This Funtion Allows to upload a file to spaces
    dedicated server:
    file : url from where is the file to upload
    visibility : "PUBLIC" || "PRIVATE"
    Public : The file can be accesed from any person with link
    Private : Need the keys or full URL to see the file 
  */
  async uploadFile(file : string,name : any, visibility : string){
    //Assing remote name according to
    var date = new Date();
    /*BUild the URL */
    const remoteFile = file.substring(0, file.length-4)+date.toISOString().replace(/\W/g, '')+file.substring(file.length-4, file.length);
    this.keyFile = remoteFile;
    /*
    Set the visibility, if the propertie is "PUBLIC"
    the file doesnt need permission to see and download
    in other case the files will be PRIVATE
    */
    let acl = undefined;
    if(visibility=='PUBLIC'){
      acl = 'public-read';
    }
    /* Build the object to sign */
    let params = {
      Bucket : bucket,
      Body:name,
      //Body : fs.readFileSync(mainFolder+file),
      Key : remoteFile,
      ACL : acl
    }
    /* The type of return must to be a promise to handle te upload time */
    return await s3.putObject(params).promise();
  };
  deleteFile(remoteFilename : string){
    let params = {
      Bucket : bucket,
      Key : remoteFilename
    }
    return s3.deleteObject(params).promise();
  }
  /*
    This function returns the Url params to acces
    private or public file 
  */
  getURLParams(){
    return s3.getSignedUrl('getObject', { Bucket: bucket, Key: this.keyFile});
  };

  getURL(){
    return 'https://data-timugo.nyc3.digitaloceanspaces.com/'+this.keyFile
  };

  getParams() {
    let urlString = s3.getSignedUrl('getObject', { Bucket: bucket, Key: this.keyFile});
    urlString = urlString.replace("https://data-timugo.nyc3.digitaloceanspaces.com", "");
    let query = url.parse(urlString, true).query;
    let params = {
      AWSAccessKeyId : query.AWSAccessKeyId,
      Expires : query.Expires,
      Signature : query.Signature
    }
    return params;
  }

  getRemoteFileName(){
    return this.keyFile;
  };

}
