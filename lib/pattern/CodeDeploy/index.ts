import * as cdk from "@aws-cdk/core";
import * as awsCodeDeploy from "@aws-cdk/aws-codedeploy";

import { BlueGreenAlarms } from "@construct/Deploy/alarms";
import { HandlerFunction } from "@construct/Deploy/handler";
import { DeploymentConfig } from "@construct/Deploy/deploymentConfig";
import { DeploymentGroup, IListeners, ITargetGroups } from "@construct/Deploy/deploymentGroup";

import * as role from "./role";
import { DeploymentResources } from "./resoruces";

interface ResourceNames {
   clusterName: string;
   applicationName: string;
}

interface DeploymentProps extends ResourceNames {
   region: string;
   account: string;
   listeners: IListeners;
   targetGroups: ITargetGroups;
}

export class Deployment extends cdk.Construct {
   public readonly deployment: DeploymentResources;

   constructor(scope: cdk.Construct, id: string, props: DeploymentProps) {
      super(scope, id);

      /**
       *
       * Deployment config
       */
      const deploymentConfig = new DeploymentConfig({
         region: props.region,
         account: props.account,
         resourceName: DeploymentConfig.ecs_10_every_minute,
      });

      /**
       *
       * Roles
       */
      const lambdaHandlerRole = new role.LambdaTargetGroupRole(this, "Lambda-Role");
      const deploymentServiceRole = new role.DeploymentGroupRole(this, "CodeDeploy-Role");

      /**
       *
       * Deployment application
       */
      new awsCodeDeploy.EcsApplication(this, "Codedeploy-App", {
         applicationName: props.applicationName,
      });

      /**
       *
       * Deployment Group Lambda
       */
      const createDGLambda = new HandlerFunction(this, "Create-DeploymentGroup", {
         role: lambdaHandlerRole,
      });

      /**
       *
       * Code Deployment Group
       */
      const blueGreenAlarms = new BlueGreenAlarms(this, "CloudWatch-BlueGreenAlarm");

      /**
       *
       * Codedeploy deployment group
       */
      new DeploymentGroup(this, "CodeDeploy-Application", {
         listeners: props.listeners,
         targetGroups: props.targetGroups,

         clusterName: props.clusterName,
         applicationName: props.applicationName,

         alarms: blueGreenAlarms,
         functionArn: createDGLambda.functionArn,
         serviceRoleArn: deploymentServiceRole.roleArn,
         deploymentConfigName: deploymentConfig.deploymentConfigName,
      });

      /**
       *
       * Deployment Resources
       */
      this.deployment = new DeploymentResources(this, "Deployment-Resources", {
         deploymentConfig,
         deployApplicationName: props.applicationName,
      });
   }
}
