import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as elb from "@aws-cdk/aws-elasticloadbalancingv2";
import { TargetGroup } from "@construct/Ecs/targetGroup";

export interface TargetGroupsProps {
   vpc: ec2.Vpc;
}

export interface ITargetGroups {
   blueGroup: elb.ApplicationTargetGroup;
   greenGroup: elb.ApplicationTargetGroup;
}

export class TargetGroups extends cdk.Construct {
   public readonly blueTargetGroupName = "Blue-Group";
   public readonly greenTargetGroupName = "Green-Group";

   public readonly blueGroup: elb.ApplicationTargetGroup;
   public readonly greenGroup: elb.ApplicationTargetGroup;

   constructor(scope: cdk.Construct, id: string, props: TargetGroupsProps) {
      super(scope, id);

      /**
       *
       * Blue Target Group
       */
      this.blueGroup = new TargetGroup(this, "Blue-Group", {
         port: 80,
         vpc: props.vpc,
         targetType: elb.TargetType.INSTANCE,
         protocol: elb.ApplicationProtocol.HTTP,
         targetGroupName: this.blueTargetGroupName,
      });

      /**
       *
       * Green Target Group
       */
      this.greenGroup = new TargetGroup(this, "Green-Group", {
         port: 80,
         vpc: props.vpc,
         targetType: elb.TargetType.INSTANCE,
         protocol: elb.ApplicationProtocol.HTTP,
         targetGroupName: this.greenTargetGroupName,
      });
   }
}
