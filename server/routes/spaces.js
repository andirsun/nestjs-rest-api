const express = require('express');
app = express();

app.post('/spaces/uploadFile', (req, res)=>{
  const spacesUtils = require('../spaces/spacesManager');
  let body = req.body;
  let fileName = body.fileName;
  let visibility = body.visibility;
  spacesUtils.uploadFile(fileName, visibility).then((response)=>{
    let responseBody = {
      response : 2,
      content : {
        message : 'UPLOADED',
        description : '¡Archivo subido exitosiamente!',
        remoteFilename : spacesUtils.getRemoteFileName(),
        url : spacesUtils.getURL(),
        urlFull : spacesUtils.getURLParams(),
        params : spacesUtils.getParams(spacesUtils.getRemoteFileName())
      }
    }
    res.send(responseBody);
  }).catch((err)=>{
    let responseBody = {
      response : 1,
      content : {
        message : 'ERROR',
        description : '¡Ups, tuvimos un problema!',
        error : 'FILE CORRUPTED OR NOT FOUND IN BACKEND'
      }
    }
    res.sendStatus(500);
    res.send(responseBody);
  });
});
app.post('/spaces/deleteFile', (req, res)=>{
  let body = req.body;
  let fileName = body.fileName;

  const spacesUtils = require('../spaces/spacesManager');
  spacesUtils.deleteFile(fileName).then((response) => {
    let responseBody = {
      response : 2,
      content : {
        message : 'DELETED',
        description : 'El archivo se eliminó exitosamente',
        details : response
      }
    }
    res.send(responseBody);
  }).catch((err)=>{
    let responseBody = {
      response : 3,
      content : {
        message : 'ERROR',
        description : 'Un error ha ocurrido, por favor intenta de nuevo'
      }
    }
  })
});
app.post('/spaces/accessFile', (req, res)=>{
  let body = req.body;
  let fileName = body.fileName;
  const spacesUtils = require('../spaces/spacesManager');
  spacesUtils.setRemoteFileName(fileName);
  let params = spacesUtils.getParams();
  let urlFull = spacesUtils.getURLParams();
  let url = spacesUtils.getURL();
  let responseBody = {
    response : 2,
    content : {
      message : "OK",
      description : "Información del archivo y cabeceras de autorización",
      fileName : fileName,
      params : params,
      urlFull : urlFull,
      url : url
    }
  }
  return res.send(responseBody);
});
module.exports = app;
