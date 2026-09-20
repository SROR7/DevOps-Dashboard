const {
  STSClient,
  GetCallerIdentityCommand,
} = require("@aws-sdk/client-sts");

const {
  EC2Client,
  DescribeInstancesCommand,
} = require("@aws-sdk/client-ec2");

const {
  S3Client,
  ListBucketsCommand,
} = require("@aws-sdk/client-s3");

const {
  EKSClient,
  ListClustersCommand,
} = require("@aws-sdk/client-eks");

const {
  RDSClient,
  DescribeDBInstancesCommand,
} = require("@aws-sdk/client-rds");

const region =
  process.env.AWS_REGION || "eu-north-1";

const sts = new STSClient({ region });
const ec2 = new EC2Client({ region });
const s3 = new S3Client({ region });
const eks = new EKSClient({ region });
const rds = new RDSClient({ region });

async function getAwsOverview() {
  const [
    identity,
    instances,
    buckets,
    clusters,
    databases,
  ] = await Promise.all([
    sts.send(
      new GetCallerIdentityCommand({})
    ),

    ec2.send(
      new DescribeInstancesCommand({})
    ),

    s3.send(
      new ListBucketsCommand({})
    ),

    eks.send(
      new ListClustersCommand({})
    ),

    rds.send(
      new DescribeDBInstancesCommand({})
    ),
  ]);

  const ec2Instances =
    instances.Reservations?.flatMap(
      (reservation) =>
        reservation.Instances || []
    ) || [];

  return {
    accountId: identity.Account,
    region,

    ec2: {
      total: ec2Instances.length,

      running: ec2Instances.filter(
        (instance) =>
          instance.State?.Name === "running"
      ).length,

      stopped: ec2Instances.filter(
        (instance) =>
          instance.State?.Name === "stopped"
      ).length,
    },

    s3: {
      total:
        buckets.Buckets?.length || 0,
    },

    eks: {
      total:
        clusters.clusters?.length || 0,

      clusters:
        clusters.clusters || [],
    },

    rds: {
      total:
        databases.DBInstances?.length || 0,
    },
  };
}

async function getEc2Instances() {
  const response = await ec2.send(
    new DescribeInstancesCommand({})
  );

  const instances =
    response.Reservations?.flatMap(
      (reservation) =>
        reservation.Instances || []
    ) || [];

  return instances.map((instance) => {
    const nameTag = instance.Tags?.find(
      (tag) => tag.Key === "Name"
    );

    return {
      id: instance.InstanceId,
      name:
        nameTag?.Value || "Unnamed",
      state:
        instance.State?.Name || "unknown",
      type:
        instance.InstanceType || "unknown",
      privateIp:
        instance.PrivateIpAddress || "-",
      publicIp:
        instance.PublicIpAddress || "-",
      availabilityZone:
        instance.Placement
          ?.AvailabilityZone || "-",
      ami:
        instance.ImageId || "-",
      launchTime:
        instance.LaunchTime || null,
    };
  });
}

async function getS3Buckets() {
  const response = await s3.send(
    new ListBucketsCommand({})
  );

  return (
    response.Buckets?.map((bucket) => ({
      name: bucket.Name,
      creationDate:
        bucket.CreationDate || null,
    })) || []
  );
}

module.exports = {
  getAwsOverview,
  getEc2Instances,
  getS3Buckets,
};