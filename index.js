const storage = require('@google-cloud/storage')();
var fs = require('fs');
var im = require('imagemagick');
var path = require('path');

/**
 * Cloud Function triggered by Cloud Storage when a file is uploaded.
 *
 * @param {object} event The Cloud Functions event.
 * @param {object} event.data A Google Cloud Storage File object.
 */
exports.cfResize = function processImage (event, callback) {
  let file = event.data;

  if (file.resourceState === 'not_exists') {
    // This was a deletion event, we don't want to process this
    return;
  }

  if (!file.bucket) {
    throw new Error('Bucket not provided. Make sure you have a "bucket" property in your request');
  }

  const thumbnailName = "thumbnail-" + file.name;
  const bucketName = "faas-thumbnail-files";

  file = storage.bucket(file.bucket).file(file.name);
  return file.download({destination:`/tmp/${path.parse(file.name).base}`})
  .then(() => {
      return new Promise((resolve) => {
        im.resize({width: 256, srcPath: '/tmp/' + file.name, dstPath: '/tmp/' + thumbnailName}, function() {
          resolve(true);//fs.readFileSync('/tmp/' + thumbnailName));
        });
      });
  }).then((content) => {
    console.log(`Saving result to ${thumbnailName} in bucket ${bucketName}`);
    return storage.bucket("faas-thumbnail-files").upload('/tmp/' + thumbnailName, {destination: thumbnailName});
  	//const thumbfile = storage.bucket(bucketName).file(thumbnailName);
  	//return thumbfile.save(content)
  }).then(() => {
      console.log('Successfully resized and uploaded to ' + bucketName + '/' + thumbnailName);
      console.log(`File ${file.name} processed.`);
  }).catch((error) => {console.log(error)})
  .then(() => {callback()});
};

exports.cfNotifyFirebase = (event, callback) => {
  var admin = require('firebase-admin');

  var serviceAccount = require('./firebase-serviceAccountKey.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://gallery-b0400.firebaseio.com/"
  });
  let file = event.data;
  var db = admin.database();
  var ref = db.ref('gallery');
  var imageRef = ref.push();
  imageRef.set({
    name: file.name,
    thumbnailUrl: `https://storage.googleapis.com/faas-thumbnail-files/${file.name}`
  })
  .then(function () {
    callback(null, 'Done.');
  }).catch(function (error) {
    callback('Database set error ' + error);
  });
};
