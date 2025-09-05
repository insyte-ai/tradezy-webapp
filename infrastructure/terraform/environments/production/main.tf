/**
 * Production Environment Terraform Configuration for Tradezy
 * 
 * This configuration sets up the production environment for the Tradezy B2B application.
 */

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

# Kubernetes provider configuration
# This will be configured after the GKE cluster is created
data "google_client_config" "default" {}

provider "kubernetes" {
  host                   = "https://${module.gke.cluster_endpoint}"
  token                  = data.google_client_config.default.access_token
  cluster_ca_certificate = base64decode(module.gke.cluster_ca_certificate)
}

# Enable required APIs
resource "google_project_service" "services" {
  for_each = toset([
    "container.googleapis.com",
    "containerregistry.googleapis.com",
    "artifactregistry.googleapis.com",
    "cloudbuild.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "monitoring.googleapis.com",
    "logging.googleapis.com",
    "dns.googleapis.com",
    "compute.googleapis.com",
    "iam.googleapis.com"
  ])

  project = var.project_id
  service = each.value

  disable_dependent_services = true
  disable_on_destroy         = false
}

# Create networking resources
module "networking" {
  source = "../../modules/networking"

  project_id  = var.project_id
  region      = var.region
  domain_name = var.domain_name
}

# Create IAM resources
module "iam" {
  source = "../../modules/iam"

  project_id                        = var.project_id
  gke_service_account_id            = "tradezy-gke-sa"
  github_actions_service_account_id = "tradezy-github-actions-sa"
  k8s_namespace                     = "default"
  k8s_service_account              = "default"
  enable_workload_identity          = false

  depends_on = [google_project_service.services]
}

# Create GKE cluster
module "gke" {
  source = "../../modules/gke"

  project_id      = var.project_id
  cluster_name    = "tradezy-cluster"
  region          = "${var.region}-a"  # Use zone instead of region
  network         = module.networking.network_name
  subnetwork      = module.networking.subnet_name
  service_account = module.iam.gke_service_account_email
  
  # Cost-effective configuration
  machine_type       = "e2-standard-2"
  initial_node_count = 1
  min_node_count     = 1
  max_node_count     = 3
  preemptible        = true
  environment        = "prod"

  depends_on = [
    google_project_service.services,
    module.networking,
    module.iam
  ]
}

# Create Workload Identity bindings for app namespace
module "workload_identity_app" {
  source = "../../modules/workload_identity"

  project_id          = var.project_id
  service_account_id  = module.iam.gke_service_account_id
  k8s_namespace       = "app"
  k8s_service_account = "tradezy-workload-identity"

  depends_on = [
    module.gke
  ]
}

# Create Artifact Registry repository for Docker images
resource "google_artifact_registry_repository" "tradezy_repo" {
  provider = google-beta

  location      = var.region
  repository_id = "tradezy-repo"
  description   = "Docker repository for Tradezy application"
  format        = "DOCKER"

  depends_on = [google_project_service.services]
}

# Output the kubeconfig command
output "kubeconfig_command" {
  description = "Command to configure kubectl"
  value       = "gcloud container clusters get-credentials ${module.gke.cluster_name} --region ${var.region} --project ${var.project_id}"
}

# Output the static IPs
output "app_ip_address" {
  description = "The static IP address for the application"
  value       = module.networking.app_ip_address
}

# Output the DNS name servers
output "dns_name_servers" {
  description = "The name servers for the DNS zone"
  value       = module.networking.dns_zone_name_servers
}

# Output the GitHub Actions service account key command
output "github_actions_key_command" {
  description = "Command to get the GitHub Actions service account key"
  value       = "terraform output -raw github_actions_key | base64 --decode > github-actions-key.json"
}

# Output the GitHub Actions service account key
output "github_actions_key" {
  description = "The key for the GitHub Actions service account"
  value       = module.iam.github_actions_key
  sensitive   = true
}

# Output the Artifact Registry URL
output "artifact_registry_url" {
  description = "The URL for the Artifact Registry"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/tradezy-repo"
}