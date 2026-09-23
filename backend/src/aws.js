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
  DescribeClusterCommand,
} = require("@aws-sdk/client-eks");

const {
  RDSClient,
  DescribeDBInstancesCommand,
} = require("@aws-sdk/client-rds");

const region = process.env.AWS_REGION || "eu-north-1";

const sts = new STSClient({ region });
const ec2 = new EC2Client({ region });
const s3 = new S3Client({ region });
const eks = new EKSClient({ region });
const rds = new RDSClient({ region });

function getErrorMessage(error) {
  return (
    error?.message ||
    error?.name ||
    "Unknown AWS error"
  );
}

async function getAwsOverview() {
  const results = await Promise.allSettled([
    sts.send(new GetCallerIdentityCommand({})),
    ec2.send(new DescribeInstancesCommand({})),
    s3.send(new ListBucketsCommand({})),
    eks.send(new ListClustersCommand({})),
    rds.send(new DescribeDBInstancesCommand({})),
  ]);

  const [
    identityResult,
    instancesResult,
    bucketsResult,
    clustersResult,
    databasesResult,
  ] = results;

  const accountId =
    identityResult.status === "fulfilled"
      ? identityResult.value.Account
      : null;

  let ec2Instances = [];
  let ec2Error = null;

  if (instancesResult.status === "fulfilled") {
    ec2Instances =
      instancesResult.value.Reservations?.flatMap(
        (reservation) =>
          reservation.Instances || []
      ) || [];
  } else {
    ec2Error = getErrorMessage(
      instancesResult.reason
    );
  }

  let buckets = [];
  let s3Error = null;

  if (bucketsResult.status === "fulfilled") {
    buckets =
      bucketsResult.value.Buckets || [];
  } else {
    s3Error = getErrorMessage(
      bucketsResult.reason
    );
  }

  let clusterNames = [];
  let eksError = null;

  if (clustersResult.status === "fulfilled") {
    clusterNames =
      clustersResult.value.clusters || [];
  } else {
    eksError = getErrorMessage(
      clustersResult.reason
    );
  }

  let databases = [];
  let rdsError = null;

  if (databasesResult.status === "fulfilled") {
    databases =
      databasesResult.value.DBInstances || [];
  } else {
    rdsError = getErrorMessage(
      databasesResult.reason
    );
  }

  return {
    accountId,
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

      error: ec2Error,
    },

    s3: {
      total: buckets.length,
      error: s3Error,
    },

    eks: {
      total: clusterNames.length,
      clusters: clusterNames,
      error: eksError,
    },

    rds: {
      total: databases.length,
      error: rdsError,
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
    const nameTag =
      instance.Tags?.find(
        (tag) => tag.Key === "Name"
      );

    return {
      id: instance.InstanceId || "-",
      name: nameTag?.Value || "Unnamed",
      state: instance.State?.Name || "unknown",
      type: instance.InstanceType || "unknown",
      privateIp: instance.PrivateIpAddress || "-",
      publicIp: instance.PublicIpAddress || "-",
      availabilityZone:
        instance.Placement?.AvailabilityZone || "-",
      ami: instance.ImageId || "-",
      launchTime: instance.LaunchTime || null,
    };
  });
}

async function getS3Buckets() {
  const response = await s3.send(
    new ListBucketsCommand({})
  );

  return (
    response.Buckets?.map(
      (bucket) => ({
        name: bucket.Name || "-",
        creationDate: bucket.CreationDate || null,
      })
    ) || []
  );
}

async function getEksClusters() {
  const response = await eks.send(
    new ListClustersCommand({})
  );

  const clusterNames =
    response.clusters || [];

  if (clusterNames.length === 0) {
    return [];
  }

  const clusters = await Promise.all(
    clusterNames.map(async (name) => {
      try {
        const result =
          await eks.send(
            new DescribeClusterCommand({
              name,
            })
          );

        const cluster =
          result.cluster || {};

        return {
          name: cluster.name || name,
          status: cluster.status || "unknown",
          version: cluster.version || "-",
          platformVersion:
            cluster.platformVersion || "-",
          endpoint: cluster.endpoint || "-",
          createdAt: cluster.createdAt || null,
          arn: cluster.arn || "-",
        };
      } catch (error) {
        return {
          name,
          status: "error",
          version: "-",
          platformVersion: "-",
          endpoint: "-",
          createdAt: null,
          arn: "-",
          error: getErrorMessage(error),
        };
      }
    })
  );

  return clusters;
}

async function getRdsDatabases() {
  const response = await rds.send(
    new DescribeDBInstancesCommand({})
  );

  return (
    response.DBInstances?.map(
      (database) => ({
        id:
          database.DBInstanceIdentifier || "-",
        status:
          database.DBInstanceStatus || "unknown",
        engine: database.Engine || "-",
        instanceClass:
          database.DBInstanceClass || "-",
        endpoint:
          database.Endpoint?.Address || "-",
        port:
          database.Endpoint?.Port || "-",
        availabilityZone:
          database.AvailabilityZone || "-",
        engineVersion:
          database.EngineVersion || "-",
      })
    ) || []
  );
}

module.exports = {
  getAwsOverview,
  getEc2Instances,
  getS3Buckets,
  getEksClusters,
  getRdsDatabases,
};