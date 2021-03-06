import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";
import * as ecs from "@aws-cdk/aws-ecs";
import * as logs from "@aws-cdk/aws-logs";
import { IContainer } from "@construct/Ecs/container";

export interface TaskDefProps {
   appName: string;
   familyName: string;
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
   public readonly taskContainers: IContainer[];

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
       * Make task containers readable
       */
      this.taskContainers = props.taskContainers;

      /**
       *
       * Register all containers
       */
      this.registerContainers(containerLogs);
   }

   private registerContainers(containerLogs: logs.LogGroup): void {
      this.taskContainers.forEach((container) => {
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
