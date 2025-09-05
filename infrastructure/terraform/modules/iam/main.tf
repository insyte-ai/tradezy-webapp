/**
 * IAM Terraform Module for Tradezy
 * 
 * This module creates the IAM resources for the Tradezy application.
 */

# Service account for GKE nodes
resource "google_service_account" "gke_service_account" {
  account_id   = var.gke_service_account_id
  display_name = "GKE Service Account for Tradezy"
  project      = var.project_id
}

# Grant the GKE service account the necessary permissions
resource "google_project_iam_member" "gke_service_account_roles" {
  for_each = toset([
    "roles/logging.logWriter",
    "roles/monitoring.metricWriter",
    "roles/monitoring.viewer",
    "roles/stackdriver.resourceMetadata.writer",
    "roles/storage.objectViewer",
    "roles/artifactregistry.reader"
  ])

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.gke_service_account.email}"
}

# Service account for GitHub Actions
resource "google_service_account" "github_actions_service_account" {
  account_id   = var.github_actions_service_account_id
  display_name = "GitHub Actions Service Account for Tradezy"
  project      = var.project_id
}

# Grant the GitHub Actions service account the necessary permissions
resource "google_project_iam_member" "github_actions_service_account_roles" {
  for_each = toset([
    "roles/container.developer",
    "roles/storage.admin",
    "roles/container.clusterAdmin",
    "roles/artifactregistry.writer"
  ])

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.github_actions_service_account.email}"
}

# Create a service account key for GitHub Actions
resource "google_service_account_key" "github_actions_key" {
  service_account_id = google_service_account.github_actions_service_account.name
}

# Workload Identity binding for GKE service account
resource "google_service_account_iam_binding" "workload_identity_binding" {
  count = var.enable_workload_identity ? 1 : 0
  
  service_account_id = google_service_account.gke_service_account.name
  role               = "roles/iam.workloadIdentityUser"

  members = [
    "serviceAccount:${var.project_id}.svc.id.goog[${var.k8s_namespace}/${var.k8s_service_account}]",
  ]
}