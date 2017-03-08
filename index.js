/**
 * Background Cloud Function to be triggered by Cloud Storage.
 *
 * @param {object} event The Cloud Functions event.
 * @param {function} The callback function.
 */
exports.helloGCS = function helloGCS (event, callback) {
  const file = event.data;
  const isDelete = file.resourceState === 'not_exists';

  if (isDelete) {
    console.log(`File ${file.name} deleted.`);
  } else {
    console.log(`File ${file.name} uploaded.`);
  }

  callback();
};
