variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "region" {
  description = "The GCP region"
  type        = string
  default     = "us-central1"
}

variable "environment" {
  description = "The environment name"
  type        = string
  default     = "production"
}

variable "domain_name" {
  description = "The domain name for the application"
  type        = string
}