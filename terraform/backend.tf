terraform {
  backend "s3" {
    bucket         = "helixium-terraform-state"
    key            = "terraform.tfstate"
    region         = "ap-southeast-2"
    encrypt        = true
    dynamodb_table = "helixium-terraform-locks"
  }
}
