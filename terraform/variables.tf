variable "aws_region" {
  description = "AWS region for ECR repositories"
  type        = string
  default     = "ap-southeast-2"
}

variable "domain_name" {
  description = "Your domain name (e.g., nicholasfane.com)"
  type        = string
  default     = "nicholasfane.com"
}

variable "subdomain" {
  description = "Subdomain for the app (e.g., helixium)"
  type        = string
  default     = "helixium"
}
