#gcloud config set project test-fass

gcloud functions deploy "cfResize" --trigger-resource="faas-files" --trigger-event=google.storage.object.finalize
gcloud functions deploy "cfNotifyFirebase" --trigger-resource="faas-thumbnail-files" --trigger-event=google.storage.object.finalize
