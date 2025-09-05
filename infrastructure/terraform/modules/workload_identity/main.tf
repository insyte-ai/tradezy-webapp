/**
 * Workload Identity Terraform Module for Tradezy
 * 
 * This module creates workload identity bindings for Kubernetes service accounts.
 */

# Create Kubernetes namespace
resource "kubernetes_namespace" "namespace" {
  metadata {
    name = var.k8s_namespace
  }
}

# Create Kubernetes service account
resource "kubernetes_service_account" "service_account" {
  metadata {
    name      = var.k8s_service_account
    namespace = kubernetes_namespace.namespace.metadata[0].name
    annotations = {
      "iam.gke.io/gcp-service-account" = "${var.service_account_id}@${var.project_id}.iam.gserviceaccount.com"
    }
  }
}

# Grant the Kubernetes service account the ability to impersonate the Google service account
resource "google_service_account_iam_member" "workload_identity_user" {
  service_account_id = "projects/${var.project_id}/serviceAccounts/${var.service_account_id}@${var.project_id}.iam.gserviceaccount.com"
  role               = "roles/iam.workloadIdentityUser"
  member             = "serviceAccount:${var.project_id}.svc.id.goog[${var.k8s_namespace}/${var.k8s_service_account}]"
}