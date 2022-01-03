import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";
import * as ecs from "@aws-cdk/aws-ecs";
import * as logs from "@aws-cdk/aws-logs";
import { IContainer } from "@construct/container";

interface Names {
   appName: string;
   familyName: string;
}

export interface TaskDefProps extends Names {
   taskContainers: IContainer[];
}

export class TaskDefRole extends iam.Role {
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
      /**
       *
       * Task Role
       */
      const taskDefRole = new TaskDefRole(scope, "Ecs-TaskRole");

      /**
       *
       * Taskdef instance
       */
      super(scope, id, {
         family: props.familyName,
         taskRole: taskDefRole,
         executionRole: taskDefRole,
      });

      /**
       *
       * Taskdef log group
       */
      const containerLogs = new logs.LogGroup(this, "Container-LogGroup", {
         logGroupName: `ecs/${props.appName}`,
         removalPolicy: cdk.RemovalPolicy.DESTROY,
      });

      /**
       *
       * Add containers
       */

      props.taskContainers.forEach((container) => {
         // Create log fore each container
         const logDriver = new ecs.AwsLogDriver({
            logGroup: containerLogs,
            streamPrefix: container.containerName,
         });

         // Add container to task def
         const taskContainer = this.addContainer(
            container.containerName,
            Object.assign(container.containerConfig, {
               logDriver,
            })
         );

         taskContainer.addPortMappings(container.portMapping);
      });
   }
}
