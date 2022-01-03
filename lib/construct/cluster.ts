import * as cdk from "@aws-cdk/core";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ec2 from "@aws-cdk/aws-ec2";

interface Options {
   instanceSize?: ec2.InstanceSize;
   instanceClass?: ec2.InstanceClass;
   machineImage?: ecs.EcsOptimizedImage;
   capacityProvider?: ecs.AsgCapacityProvider;
}

export interface EcsClusterProps extends Options {
   readonly vpc: ec2.Vpc;
   readonly clusterName?: string;
}

class DefaultOptions {
   static instanceClass = ec2.InstanceClass.T2;
   static instanceSize = ec2.InstanceSize.SMALL;
   static machineImage = ecs.EcsOptimizedImage.amazonLinux2();
}

export class Cluster extends ecs.Cluster {
   constructor(scope: cdk.Construct, id: string, props: EcsClusterProps) {
      super(scope, id, {
         vpc: props.vpc,
         clusterName: props.clusterName,

         capacity: {
            instanceType: ec2.InstanceType.of(
               props.instanceClass || DefaultOptions.instanceClass,
               props.instanceSize || DefaultOptions.instanceSize
            ),
            machineImage: props.machineImage || DefaultOptions.machineImage,
         },
      });

      // if (props.capacityProvider) {
      //    this.addAsgCapacityProvider(props.capacityProvider);
      // }
   }
}
