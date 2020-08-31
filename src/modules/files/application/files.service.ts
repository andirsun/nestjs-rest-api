/* Nest dependencies */
import { Injectable } from '@nestjs/common';

const mainFolder = process.env.FILES_MAIN_FOLDER || "";

/* external libraries*/
require('dotenv').config();
const AWS = require('aws-sdk');
const fs = require('fs');
const url = require('url');
const bucket = 'data-timugo';
const spacesEndpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com');
/* Amazon spaces configs */
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId : process.env.S3_ACCESS_KEY,
  secretAccessKey : process.env.S3_SECRET_KEY
});
/*
* Instructions how to use this module :
* Functionality : the module allow upload every type of file to
*                 dedicated timugo file server, and then obteins 
*                 the url of the file
* Permissions : The file could be PUBLIC Or PRIVATE
* Steps :
* 1) Import the file service in any module 
*     example : import { FilesService } from 'src/modules/files/files.service';
*     constructor (private filesService : FilesService ){} 
* 2) Create a url to insert the file*
*     example : string = `Pets/Products/${partner._id}/${product._id}/`;
* 3) Use the promise function uploadFile with the params : 
*     example :  this.filesService.uploadFile(remotePath,file.originalname,file.buffer,"PUBLIC")
* 4) Get the file URL, NAME etc :
*     example : 
*                content : {
*                  message : 'UPLOADED',
*                  description : '¡Archivo subido exitosiamente!',
*                  remoteFilename : this.filesService.getRemoteFileName(),
*                  url : this.filesService.getURL(),
*                  urlFull : this.filesService.getURLParams(),
*                                    
*								 }
*
*/
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
  async uploadFile(path : string,fileName : string,fileBuffer : any, visibility : string){
    //Assing remote name according to
    var date = new Date();
    /*BUild the URL */
    const remoteURLFile : string =path+fileName.substring(0, fileName.length-4)+date.toISOString()
                        .replace(/\W/g, '')+fileName.substring(fileName.length-4, fileName.length);
    this.keyFile = remoteURLFile;
    /*
    Set the visibility, if the propertie is "PUBLIC"
    the file doesnt need permission to see and download
    in other case the files will be PRIVATE
    */
    let acl : string = undefined;
    if(visibility=='PUBLIC'){
      acl = 'public-read';
    }
    /* Build the object to sign */
    let params = {
      Bucket : bucket,
      Body : fileBuffer,
      //Body : fs.readFileSync(mainFolder+file),
      Key : remoteURLFile,
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
    Getters
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
