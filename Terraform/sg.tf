module "security_group" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "~> 5.0"

  name        = "devops-dashboard-sg"
  description = "Security group for DevOps Dashboard"
  vpc_id      = module.vpc.vpc_id

  ingress_with_cidr_blocks = [
    {
      from_port   = 80
      to_port     = 80
      protocol    = "tcp"
      description = "HTTP"
      cidr_blocks = "0.0.0.0/0"
    },
    {
      from_port   = 443
      to_port     = 443
      protocol    = "tcp"
      description = "HTTPS"
      cidr_blocks = "0.0.0.0/0"
    },
    {
      from_port   = 22
      to_port     = 22
      protocol    = "tcp"
      description = "SSH"
      cidr_blocks = var.ssh_allowed_cidr
    }
  ]

  egress_rules = ["all-all"]
}