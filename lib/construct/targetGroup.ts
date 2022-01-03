import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as elb from "@aws-cdk/aws-elasticloadbalancingv2";

interface ResourceNames {
   targetGroupName: string;
}

interface Options {
   port?: number;
   timeout?: cdk.Duration;
   interval?: cdk.Duration;
   targetType?: elb.TargetType;
   protocol?: elb.ApplicationProtocol;

   healthCheck?: {
      path: string;
      healthyHttpCodes: string;
      timeout: cdk.Duration;
      interval: cdk.Duration;
   };
}

interface TargetGroupProps extends ResourceNames, Options {
   vpc: ec2.Vpc;
}

class DefaultOptions {
   static port = 80;
   static healthCheck = {
      path: "/",
      healthyHttpCodes: "200,404",
      timeout: cdk.Duration.seconds(10),
      interval: cdk.Duration.seconds(15),
   };
   static protocol = elb.ApplicationProtocol.HTTP;
}

export class TargetGroup extends elb.ApplicationTargetGroup {
   constructor(scope: cdk.Construct, id: string, props: TargetGroupProps) {
      super(scope, id, {
         vpc: props.vpc,
         targetType: props.targetType,

         port: props.port || DefaultOptions.port,
         targetGroupName: props.targetGroupName,

         protocol: props.protocol || DefaultOptions.protocol,
         healthCheck: { ...props.healthCheck, ...DefaultOptions.healthCheck },
      });
   }
}
