terraform {
  backend "gcs" {
    # Bucket name will be provided during terraform init
    # terraform init -backend-config="bucket=YOUR_BUCKET_NAME" -backend-config="prefix=terraform/state"
    prefix = "terraform/state"
  }
}