# VPC
resource "aws_vpc" "helixium" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name    = "helixium-vpc"
    Project = "helixium"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "helixium" {
  vpc_id = aws_vpc.helixium.id

  tags = {
    Name    = "helixium-igw"
    Project = "helixium"
  }
}

# Public Subnets
resource "aws_subnet" "public" {
  count             = 2
  vpc_id            = aws_vpc.helixium.id
  cidr_block        = "10.0.${count.index + 1}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  map_public_ip_on_launch = true

  tags = {
    Name    = "helixium-public-${count.index + 1}"
    Project = "helixium"
  }
}

# Private Subnets (using public subnets for cost optimization)
resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.helixium.id
  cidr_block        = "10.0.${count.index + 10}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  map_public_ip_on_launch = true  # Enable public IPs for cost optimization

  tags = {
    Name    = "helixium-private-${count.index + 1}"
    Project = "helixium"
  }
}

# Route Table for Public Subnets
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.helixium.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.helixium.id
  }

  tags = {
    Name    = "helixium-public-rt"
    Project = "helixium"
  }
}

# Route Table Association for Public Subnets
resource "aws_route_table_association" "public" {
  count          = 2
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# NAT Gateway (removed for cost optimization)
# Using public subnets instead to avoid ~$45/month NAT Gateway cost

# Route Table for Private Subnets (using public routing for cost optimization)
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.helixium.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.helixium.id
  }

  tags = {
    Name    = "helixium-private-rt"
    Project = "helixium"
  }
}

# Route Table Association for Private Subnets
resource "aws_route_table_association" "private" {
  count          = 2
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}

# ALB Security Group removed for cost optimization

# Security Group for ECS Tasks (Direct Access)
resource "aws_security_group" "ecs" {
  name        = "helixium-ecs-sg"
  description = "Security group for ECS tasks with direct HTTP access"
  vpc_id      = aws_vpc.helixium.id

  ingress {
    description = "HTTP from anywhere"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "helixium-ecs-sg"
    Project = "helixium"
  }
}

# Data source for availability zones
data "aws_availability_zones" "available" {
  state = "available"
}
