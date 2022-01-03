import * as cdk from "@aws-cdk/core";
import * as ecs from "@aws-cdk/aws-ecs";

interface Options {
   desiredCount?: number;
   healthCheckGracePeriod?: cdk.Duration;
   deploymentController?: ecs.DeploymentControllerType;
}

export interface ServiceProps extends Options {
   cluster: ecs.Cluster;
   serviceName?: string;
   taskDefinition: ecs.TaskDefinition;
}

class DefaultOptions {
   static desiredCount = 1;
   static healthCheckGracePeriod = cdk.Duration.hours(3);
   static deploymentController = ecs.DeploymentControllerType.CODE_DEPLOY;
}

export class Service extends ecs.Ec2Service {
   constructor(scope: cdk.Construct, id: string, props: ServiceProps) {
      super(scope, id, {
         cluster: props.cluster,
         serviceName: props.serviceName,
         taskDefinition: props.taskDefinition,

         desiredCount: props.desiredCount || DefaultOptions.desiredCount,

         healthCheckGracePeriod:
            props.healthCheckGracePeriod || DefaultOptions.healthCheckGracePeriod,

         deploymentController: {
            type: props.deploymentController || DefaultOptions.deploymentController,
         },
      });
   }
}
