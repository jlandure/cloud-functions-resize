#gcloud config set project test-fass

gcloud alpha functions deploy "cfResize" --stage-bucket "cloud-functions-resize" --trigger-provider=cloud.storage --trigger-event=object.change --trigger-resource="faas-files"
gcloud alpha functions deploy "cfNotifyFirebase" --stage-bucket "cloud-functions-resize" --trigger-provider=cloud.storage --trigger-event=object.change --trigger-resource="faas-thumbnail-files"
