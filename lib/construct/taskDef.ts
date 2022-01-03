import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";
import * as ecs from "@aws-cdk/aws-ecs";
import * as logs from "@aws-cdk/aws-logs";
import { ContainerImage } from "@construct/containerImage";

interface TaskRoles {
   taskRole: iam.Role;
   executionRole: iam.Role;
}

export interface TaskDefProps extends TaskRoles {
   appName: string;
   familyName: string;
}

export class EcsTaskRole extends iam.Role {
   constructor(scope: cdk.Construct, id: string) {
      super(scope, id, {
         assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
      });

      this.addManagedPolicy(
         iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AmazonECSTaskExecutionRolePolicy")
      );
   }
}

export class TaskDef extends ecs.Ec2TaskDefinition {
   constructor(scope: cdk.Construct, id: string, props: TaskDefProps) {
      super(scope, id, {
         family: props.familyName,
         taskRole: props.taskRole,
         executionRole: props.taskRole,
      });

      const containerImage = new ContainerImage(scope, id, {
         repoName: "backend",
         tagName: "latest",
      });

      const containerLogs = new logs.LogGroup(this, "Container-LogGroup", {
         logGroupName: `ecs/${props.appName}`,
         removalPolicy: cdk.RemovalPolicy.DESTROY,
      });

      const logDriver = new ecs.AwsLogDriver({
         logGroup: containerLogs,
         streamPrefix: "Containername",
      });

      const container = this.addContainer("ContainerName", {
         cpu: 1,
         memoryLimitMiB: 512,
         logging: logDriver,
         image: containerImage.image,
         containerName: "Containername",
      });

      container.addPortMappings({
         containerPort: 80,
         protocol: ecs.Protocol.TCP,
      });
   }
}
