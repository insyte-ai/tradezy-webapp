variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "cluster_name" {
  description = "The name of the GKE cluster"
  type        = string
}

variable "region" {
  description = "The region for the GKE cluster"
  type        = string
}

variable "network" {
  description = "The VPC network to host the cluster"
  type        = string
}

variable "subnetwork" {
  description = "The subnetwork to host the cluster"
  type        = string
}

variable "service_account" {
  description = "The service account to use for the nodes"
  type        = string
}

variable "machine_type" {
  description = "The machine type for nodes"
  type        = string
  default     = "e2-standard-2"
}

variable "initial_node_count" {
  description = "Initial number of nodes"
  type        = number
  default     = 1
}

variable "min_node_count" {
  description = "Minimum number of nodes"
  type        = number
  default     = 1
}

variable "max_node_count" {
  description = "Maximum number of nodes"
  type        = number
  default     = 3
}

variable "preemptible" {
  description = "Use preemptible instances"
  type        = bool
  default     = true
}

variable "environment" {
  description = "Environment label"
  type        = string
  default     = "prod"
}

variable "pods_ipv4_cidr_block" {
  description = "The IP address range for pods"
  type        = string
  default     = "10.4.0.0/14"
}

variable "services_ipv4_cidr_block" {
  description = "The IP address range for services"
  type        = string
  default     = "10.8.0.0/20"
}