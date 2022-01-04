import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";

/**
 *
 * Codedeploy Deployment Group Role
 */
export class DeploymentGroupRole extends iam.Role {
   constructor(scope: cdk.Construct, id: string) {
      super(scope, id, {
         assumedBy: new iam.ServicePrincipal("codedeploy.amazonaws.com"),
      });

      this.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("AWSCodeDeployRoleForECS"));
   }
}

/**
 *
 * Lambda Role
 */
export class LambdaTargetGroupRole extends iam.Role {
   constructor(scope: cdk.Construct, id: string) {
      /**
       *
       * Lambda Role Instance
       */
      super(scope, id, {
         assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      });

      /**
       *
       * Actions
       */
      const inlinePolicyForLambda = new iam.PolicyStatement({
         effect: iam.Effect.ALLOW,
         actions: [
            "iam:PassRole",
            "sts:AssumeRole",
            "codedeploy:List*",
            "codedeploy:Get*",
            "codedeploy:UpdateDeploymentGroup",
            "codedeploy:CreateDeploymentGroup",
            "codedeploy:DeleteDeploymentGroup",
         ],
         resources: ["*"],
      });

      /**
       *
       * Add Policy to Roe
       */
      this.addToPolicy(inlinePolicyForLambda);

      /**
       *
       * Lmabda Execution plicy
       */
      this.addManagedPolicy(
         iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole")
      );
   }
}
