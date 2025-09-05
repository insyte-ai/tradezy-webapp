output "gke_service_account_email" {
  description = "The email of the GKE service account"
  value       = google_service_account.gke_service_account.email
}

output "gke_service_account_id" {
  description = "The ID of the GKE service account"
  value       = google_service_account.gke_service_account.account_id
}

output "github_actions_service_account_email" {
  description = "The email of the GitHub Actions service account"
  value       = google_service_account.github_actions_service_account.email
}

output "github_actions_key" {
  description = "The key for the GitHub Actions service account"
  value       = base64encode(google_service_account_key.github_actions_key.private_key)
  sensitive   = true
}