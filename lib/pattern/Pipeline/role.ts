import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";

export class ProjectRole extends iam.Role {
   constructor(scope: cdk.Construct, id: string) {
      super(scope, id, {
         assumedBy: new iam.ServicePrincipal("codebuild.amazonaws.com"),
      });

      this.addToPolicy(
         new iam.PolicyStatement({
            actions: ["cloudformation:*", "sts:*", "secretsmanager:*"],
            resources: ["*"],
         })
      );
   }
}
