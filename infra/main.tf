terraform {
  backend "s3" {
    bucket         = "terraform-state-2024100601"
    key            = "infra/datalake-import-rbnz.tfstate"
    region         = "ap-southeast-2"
    encrypt        = true
    dynamodb_table = "terraform-state-lock-20241006"
  }
}

provider "aws" {
  region = "ap-southeast-2"
}

variable "aws_account" {
  default = "329548127068"
}

variable "region" {
  default = "ap-southeast-2"
}

variable "repo" {
  default = "https://github.com/ehuysamer/datalake-import-rbnz.git"
}

variable "github_token_secret_name" {
  default = "homecontroller-github-codebuild"
}

resource "aws_iam_role" "codebuild_role" {
  name = "CodeBuildTerraformRoleDatalakeImportRbnz"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = "codebuild.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_policy" "codebuild_policy" {
  name        = "CodeBuildTerraformPolicyDatalakeImportRbnz"
  description = "Permissions for CodeBuild to execute Terraform and npm tasks"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "cloudformation:*",
          "lambda:*",
          "iam:CreateRole",
          "iam:DeleteRole",
          "iam:TagRole",
          "iam:PassRole",
          "iam:GetRolePolicy",
          "iam:AttachRolePolicy",
          "iam:DetachRolePolicy",
          "iam:PutRolePolicy",
          "iam:DeleteRolePolicy",
          "apigateway:*",
          "s3:*",
          "logs:*",
          "cloudwatch:*"
        ],
        Resource = "*",
        Effect   = "Allow",
      },
      {
        Action = [
          "secretsmanager:GetSecretValue", # To get GitHub token
          "kms:Decrypt"
        ],
        Resource = "*",
        Effect   = "Allow",
        Resource = "*"
      },
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:GetLogEvents",
          "logs:DescribeLogStreams"
        ],
        Resource = "*",
        Effect   = "Allow"
      },
      {
        Action = [
          "codebuild:ListSourceCredentials",
          "codebuild:BatchGetProjects",
          "codebuild:StartBuild",
          "codebuild:BatchGetBuilds",
          "codebuild:BatchGetBuildBatches",
          "codebuild:BatchGetReports",
          "codebuild:BatchDeleteBuilds",
          "codebuild:ListBuildsForProject",
          "codebuild:UpdateWebhook"
        ],
        //Resource = "arn:aws:codebuild:ap-southeast-2:329548127068:project/datalake-import-rbnz",
        Resource = "*",
        Effect   = "Allow"
      },
      {
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListBucket",
          "s3:DeleteObject",
          "s3:HeadObject"
        ],
        "Resource" : "arn:aws:s3:::terraform-state-2024100601/*",
        Effect = "Allow"
      },
      {
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem"
        ],
        "Resource" : "arn:aws:dynamodb:${var.region}:${var.aws_account}:table/terraform-state-lock-20241006",
        Effect = "Allow"
      },
      {
        Action = [
          "cloudformation:ListExports",
        ],
        "Resource" : "*",
        Effect = "Allow"
      },
      {
        Action = [
          "route53:ListHostedZones",
        ],
        "Resource" : "*",
        Effect = "Allow"
      },
      {
        Action = [
          "route53:GetHostedZone",
          "route53:ListResourceRecordSets",
          "route53:ChangeResourceRecordSets",
          "route53:ListHostedZonesByName",
          "route53:CreateHostedZone",
          "route53:DeleteHostedZone",
          "route53:ListTagsForResource"
        ],
        "Resource" : "arn:aws:route53:::hostedzone/Z051871939S9KDL2O4UON",
        Effect = "Allow"
      },
      {
        Action = [
          "iam:CreateRole",
          "iam:AttachRolePolicy",
          "iam:DetachRolePolicy",
          "iam:PutRolePolicy",
          "iam:ListRolePolicies",
          "iam:ListAttachedRolePolicies",
          "iam:DeleteRolePolicy",

          "iam:PassRole",
          "iam:GetRole",
          "iam:DeleteRole",
          "iam:UpdateRoleDescription",
          "iam:UpdateRole",
          "iam:ListRoles",

          "iam:CreatePolicy",
          "iam:CreatePolicyVersion",
          "iam:GetPolicy",
          "iam:GetPolicyVersion",
          "iam:ListPolicyVersions",
          "iam:DeletePolicy",
          "iam:DeletePolicyVersion",

          "iam:UpdateAssumeRolePolicy",

          "iam:",
        ],
        "Resource" : "*",
        Effect = "Allow"
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "secretsmanager:GetSecretValue"
        ],
        "Resource" : "arn:aws:secretsmanager:${var.region}:${var.aws_account}:secret:homecontroller-github-codebuild"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "codebuild_policy_attachment" {
  role       = aws_iam_role.codebuild_role.name
  policy_arn = aws_iam_policy.codebuild_policy.arn
}

data "aws_secretsmanager_secret_version" "github_token" {
  secret_id = var.github_token_secret_name
}

resource "aws_codebuild_project" "project" {
  name          = "datalake-import-rbnz"
  description   = "Import data from RBNZ"
  build_timeout = "5"
  service_role  = aws_iam_role.codebuild_role.arn
  source {
    type            = "GITHUB"
    location        = var.repo
    buildspec       = "buildspec.yml"
    git_clone_depth = 1

    git_submodules_config {
      fetch_submodules = false
    }

    build_status_config {
      context = "CodeBuild"
    }
  }
  artifacts {
    type = "NO_ARTIFACTS"
  }

  cache {
    type  = "LOCAL"
    modes = ["LOCAL_SOURCE_CACHE", "LOCAL_CUSTOM_CACHE"]
  }

  environment {
    compute_type    = "BUILD_GENERAL1_SMALL"
    image           = "aws/codebuild/standard:6.0" #Previous 1.0
    type            = "LINUX_CONTAINER"
    privileged_mode = false
  }

  logs_config {
    cloudwatch_logs {
      group_name  = "/aws/codebuild/datalake-import-rbnz"
      stream_name = "build-log"
    }
  }

  tags = {
    Environment = "Prod"
    Project     = "DatalakeImportRbnz"
  }
}

resource "aws_codebuild_source_credential" "github" {
  auth_type   = "PERSONAL_ACCESS_TOKEN"
  server_type = "GITHUB"
  token       = data.aws_secretsmanager_secret_version.github_token.secret_string
}

resource "aws_codebuild_webhook" "github_webhook" {
  project_name = aws_codebuild_project.project.name

  filter_group {
    filter {
      type    = "EVENT"
      pattern = "PUSH"
    }

    filter {
      type    = "HEAD_REF"
      pattern = "refs/heads/master" # Change to your desired branch
    }
  }

  depends_on = [
    aws_codebuild_project.project,
    aws_iam_role_policy_attachment.codebuild_policy_attachment,
    aws_codebuild_source_credential.github
  ]
}

# Domain name

data "aws_route53_zone" "domain_name" {
  name         = "richochet.link"
  private_zone = false
}

output "project_name" {
  value = aws_codebuild_project.project.name
}

