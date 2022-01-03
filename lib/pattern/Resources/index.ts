import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as elb from "@aws-cdk/aws-elasticloadbalancingv2";

export class Resources extends cdk.Construct {
   public readonly vpc: ec2.Vpc;
   public readonly loadBalancer: elb.ApplicationLoadBalancer;

   constructor(scope: cdk.Construct, id: string) {
      super(scope, id);

      /**
       *
       * Main Vpc
       */
      this.vpc = new ec2.Vpc(this, "Vpc", {
         maxAzs: 3,
         natGateways: 1,
         cidr: "10.1.0.0/16",
      });

      /**
       *
       * Application Load Balancer
       */
      this.loadBalancer = new elb.ApplicationLoadBalancer(this, "App-Loadbalancer", {
         vpc: this.vpc,
         internetFacing: true,
      });
   }
}
