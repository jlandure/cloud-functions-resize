/**
 * Cloud Function triggered by Cloud Storage when a file is uploaded.
 *
 * @param {object} event The Cloud Functions event.
 * @param {object} event.data A Google Cloud Storage File object.
 */
exports.processFile = function processImage (event) {
  let file = event.data;

  return Promise.resolve()
    .then(() => {
      if (file.resourceState === 'not_exists') {
        // This was a deletion event, we don't want to process this
        return;
      }

      if (!file.bucket) {
        throw new Error('Bucket not provided. Make sure you have a "bucket" property in your request');
      }
      if (!file.name) {
        throw new Error('Filename not provided. Make sure you have a "name" property in your request');
      }

      file = storage.bucket(file.bucket).file(file.name);

      return JSON.stringify(file);
    })
    .then(() => {
      console.log(`File ${file.name} processed.`);
    });
};