/**
 * Networking Terraform Module for Tradezy
 * 
 * This module creates the networking resources for the Tradezy application.
 */

# VPC Network
resource "google_compute_network" "vpc" {
  name                    = var.network_name
  auto_create_subnetworks = false
  project                 = var.project_id
}

# Subnet
resource "google_compute_subnetwork" "subnet" {
  name          = var.subnet_name
  ip_cidr_range = var.subnet_cidr
  region        = var.region
  network       = google_compute_network.vpc.id
  project       = var.project_id

  # Enable flow logs for security analysis
  log_config {
    aggregation_interval = "INTERVAL_5_SEC"
    flow_sampling        = 0.5
    metadata             = "INCLUDE_ALL_METADATA"
  }

  # Enable private Google access
  private_ip_google_access = true
}

# Cloud Router for NAT
resource "google_compute_router" "router" {
  name    = "${var.network_name}-router"
  region  = var.region
  network = google_compute_network.vpc.id
  project = var.project_id
}

# Cloud NAT for outbound internet access from private instances
resource "google_compute_router_nat" "nat" {
  name                               = "${var.network_name}-nat"
  router                             = google_compute_router.router.name
  region                             = var.region
  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"
  project                            = var.project_id

  log_config {
    enable = true
    filter = "ERRORS_ONLY"
  }
}

# Firewall rule to allow internal communication
resource "google_compute_firewall" "internal" {
  name    = "${var.network_name}-allow-internal"
  network = google_compute_network.vpc.name
  project = var.project_id

  allow {
    protocol = "icmp"
  }

  allow {
    protocol = "tcp"
  }

  allow {
    protocol = "udp"
  }

  source_ranges = [var.subnet_cidr]
}

# Firewall rule to allow health checks
resource "google_compute_firewall" "health_checks" {
  name    = "${var.network_name}-allow-health-checks"
  network = google_compute_network.vpc.name
  project = var.project_id

  allow {
    protocol = "tcp"
    ports    = ["80", "443", "3000", "5000"]
  }

  source_ranges = ["35.191.0.0/16", "130.211.0.0/22"]
}

# Static IP for the application
resource "google_compute_global_address" "app_ip" {
  name         = "tradezy-app-ip"
  project      = var.project_id
  address_type = "EXTERNAL"
}

# DNS Zone (optional - only create if domain_name is provided)
resource "google_dns_managed_zone" "dns_zone" {
  count       = var.domain_name != "" ? 1 : 0
  name        = "tradezy-dns-zone"
  dns_name    = "${var.domain_name}."
  project     = var.project_id
  description = "DNS zone for Tradezy application"
}

# DNS Record for the application
resource "google_dns_record_set" "app" {
  count        = var.domain_name != "" ? 1 : 0
  name         = google_dns_managed_zone.dns_zone[0].dns_name
  type         = "A"
  ttl          = 300
  managed_zone = google_dns_managed_zone.dns_zone[0].name
  project      = var.project_id
  rrdatas      = [google_compute_global_address.app_ip.address]
}

# DNS Record for www
resource "google_dns_record_set" "www" {
  count        = var.domain_name != "" ? 1 : 0
  name         = "www.${google_dns_managed_zone.dns_zone[0].dns_name}"
  type         = "A"
  ttl          = 300
  managed_zone = google_dns_managed_zone.dns_zone[0].name
  project      = var.project_id
  rrdatas      = [google_compute_global_address.app_ip.address]
}