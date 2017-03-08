#gcloud config set project test-fass

#gcloud alpha functions deploy "cf-resize" --stage-bucket "cloud-functions-resize" --trigger-bucket "faas-files"
gcloud alpha functions deploy "cf-resize" --stage-bucket "cloud-functions-resize" --trigger-provider=cloud.storage --trigger-event=object.change --trigger-resource="faas-files"
