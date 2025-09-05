variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "region" {
  description = "The GCP region"
  type        = string
}

variable "network_name" {
  description = "The name of the VPC network"
  type        = string
  default     = "tradezy-network"
}

variable "subnet_name" {
  description = "The name of the subnet"
  type        = string
  default     = "tradezy-subnet"
}

variable "subnet_cidr" {
  description = "The CIDR range for the subnet"
  type        = string
  default     = "10.0.0.0/20"
}

variable "domain_name" {
  description = "The domain name for the application (optional)"
  type        = string
  default     = ""
}