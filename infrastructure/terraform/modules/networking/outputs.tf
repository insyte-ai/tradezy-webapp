output "network_name" {
  description = "The name of the VPC network"
  value       = google_compute_network.vpc.name
}

output "subnet_name" {
  description = "The name of the subnet"
  value       = google_compute_subnetwork.subnet.name
}

output "subnet_cidr" {
  description = "The CIDR range of the subnet"
  value       = google_compute_subnetwork.subnet.ip_cidr_range
}

output "app_ip_address" {
  description = "The static IP address for the application"
  value       = google_compute_global_address.app_ip.address
}

output "dns_zone_name_servers" {
  description = "The name servers for the DNS zone"
  value       = var.domain_name != "" ? google_dns_managed_zone.dns_zone[0].name_servers : []
}