output "k8s_service_account_name" {
  description = "The name of the Kubernetes service account"
  value       = kubernetes_service_account.service_account.metadata[0].name
}

output "k8s_namespace" {
  description = "The Kubernetes namespace"
  value       = kubernetes_namespace.namespace.metadata[0].name
}