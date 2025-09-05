variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "service_account_id" {
  description = "The Google service account ID"
  type        = string
}

variable "k8s_namespace" {
  description = "The Kubernetes namespace"
  type        = string
}

variable "k8s_service_account" {
  description = "The Kubernetes service account name"
  type        = string
}