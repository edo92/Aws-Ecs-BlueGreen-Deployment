import * as path from "path";
import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";
import * as lambda from "@aws-cdk/aws-lambda";

interface HandlerFunctionProps {
   role: iam.Role;
}

export class HandlerFunction extends lambda.Function {
   constructor(scope: cdk.Construct, id: string, props: HandlerFunctionProps) {
      /**
       *
       *  Script Code Asset -> handler.create_deployment_group.py
       */
      const scriptCode = lambda.Code.fromAsset(path.join(__dirname, "handler"), {
         exclude: ["**", "!create_deployment_group.py"],
      });

      /**
       *
       * Function Instance
       */
      super(scope, id, {
         code: scriptCode,
         role: props.role,
         memorySize: 128,
         runtime: lambda.Runtime.PYTHON_3_8,
         timeout: cdk.Duration.seconds(60),
         handler: "create_deployment_group.handler",
         description: "Custom resource to create deployment group",
      });
   }
}
