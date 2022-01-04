import * as cdk from "@aws-cdk/core";
import * as codedeploy from "@aws-cdk/aws-codedeploy";

interface DeploymentResourcesProps {
   deployApplicationName: string;
   deploymentConfig: codedeploy.IEcsDeploymentConfig;
}

export class DeploymentResources extends cdk.Construct {
   public readonly deploymentGroup: codedeploy.IEcsDeploymentGroup;

   constructor(scope: cdk.Construct, id: string, props: DeploymentResourcesProps) {
      super(scope, id);

      /**
       *
       * Codedeploy Application
       */
      const codeDeployApplication = codedeploy.EcsApplication.fromEcsApplicationName(
         this,
         "Existing-CodeDeploy-Application",
         props.deployApplicationName
      );

      /**
       *
       * Codedeploy Deployment Group
       */
      this.deploymentGroup = codedeploy.EcsDeploymentGroup.fromEcsDeploymentGroupAttributes(
         this,
         "Existing-Ecs-DeploymentGroup",
         {
            application: codeDeployApplication,
            deploymentConfig: props.deploymentConfig,
            deploymentGroupName: props.deployApplicationName,
         }
      );
   }
}
