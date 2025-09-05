variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "gke_service_account_id" {
  description = "The ID for the GKE service account"
  type        = string
}

variable "github_actions_service_account_id" {
  description = "The ID for the GitHub Actions service account"
  type        = string
}

variable "k8s_namespace" {
  description = "The Kubernetes namespace"
  type        = string
  default     = "default"
}

variable "k8s_service_account" {
  description = "The Kubernetes service account"
  type        = string
  default     = "default"
}

variable "enable_workload_identity" {
  description = "Enable workload identity binding"
  type        = bool
  default     = false
}