import * as cdk from "@aws-cdk/core";
import * as elb from "@aws-cdk/aws-elasticloadbalancingv2";

interface ITargetGroups {
   blueGroup: elb.ApplicationTargetGroup;
   greenGroup: elb.ApplicationTargetGroup;
}

interface ListenersProps {
   targetGroups: ITargetGroups;
   loadBalancer: elb.ApplicationLoadBalancer;
}

export class Listeners extends cdk.Construct {
   public readonly prodListenerArnOutputName = "prodListenerArn";
   public readonly testListenerArnOutputName = "testListenerArn";

   public readonly prodListener: elb.ApplicationListener;
   public readonly testListener: elb.ApplicationListener;

   constructor(scope: cdk.Construct, id: string, props: ListenersProps) {
      super(scope, id);

      /**
       *
       * Listeners
       */
      this.prodListener = props.loadBalancer.addListener(`Production-Listener`, {
         port: 80,
         open: true,
      });

      this.testListener = props.loadBalancer.addListener("Test-Listener", {
         port: 8080,
      });

      /**
       *
       * Connectons
       */
      this.prodListener.connections.allowDefaultPortFromAnyIpv4("Allow traffic from everywhere");
      this.testListener.connections.allowDefaultPortFromAnyIpv4("Allow traffic from everywhere");

      /**
       *
       * Target Groups -> Blue/Green
       */
      this.prodListener.addTargetGroups(props.targetGroups.blueGroup.targetGroupName, {
         targetGroups: [props.targetGroups.blueGroup],
      });

      this.testListener.addTargetGroups(props.targetGroups.blueGroup.targetGroupName, {
         targetGroups: [props.targetGroups.greenGroup],
      });

      /**
       *
       * Outputs
       */
      new cdk.CfnOutput(this, "ProdListener-Arn-Output", {
         description: "Production Listener Arn",
         exportName: this.prodListenerArnOutputName,
         value: this.prodListener.listenerArn,
      });

      new cdk.CfnOutput(this, "TestListener-Arn-Output", {
         description: "Test Listener Arn",
         exportName: this.testListenerArnOutputName,
         value: this.testListener.listenerArn,
      });
   }
}
