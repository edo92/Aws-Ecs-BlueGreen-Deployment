import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as elb from "@aws-cdk/aws-elasticloadbalancingv2";

import { Cluster } from "@construct/Ecs/cluster";
import { Service } from "@construct/Ecs/service";
import { TaskDef } from "@construct/Ecs/taskDef";

import { Listeners } from "./listeners";
import { TargetGroups } from "./targetGroup";
import { TaskContainer } from "./taskContainer";

export interface IEcsService {
   readonly listeners: Listeners;
   readonly targetGroups: TargetGroups;
   readonly cluster: ecs.Cluster;
   readonly service: ecs.Ec2Service;
   readonly taskDef: TaskDef;
}

export interface EcsServiceProps {
   readonly names: INames;
   readonly vpc: ec2.Vpc;
   readonly elb: elb.ApplicationLoadBalancer;
}

export class EcsService extends cdk.Construct implements IEcsService {
   public readonly applicationName: string;
   public readonly listeners: Listeners;
   public readonly targetGroups: TargetGroups;

   public readonly cluster: ecs.Cluster;
   public readonly service: ecs.Ec2Service;
   public readonly taskDef: TaskDef;

   constructor(scope: cdk.Construct, id: string, props: EcsServiceProps) {
      super(scope, id);
      this.applicationName = props.names.applicationName;

      /**
       *
       * Target Groups
       */
      this.targetGroups = new TargetGroups(this, "Target-Group", {
         vpc: props.vpc,
      });

      /**
       *
       * Listeners
       */
      this.listeners = new Listeners(this, "LoadBalancer-Listeners", {
         loadBalancer: props.elb,
         targetGroups: this.targetGroups,
      });

      /**
       *
       * Ecs Cluster
       */
      this.cluster = new Cluster(this, "Ecs-Cluster", {
         vpc: props.vpc,
         clusterName: props.names.clusterName,
      });

      /**
       *
       * Task Containers
       */
      const container = new TaskContainer(this, "Task-Containers", {
         appName: this.applicationName,
      });

      /**
       *
       * Ecs Task Definition
       */
      this.taskDef = new TaskDef(this, "Ecs-TaskDef", {
         appName: this.applicationName,
         familyName: props.names.familyName,
         taskContainers: container.allContainers,
      });

      /**
       *
       * Ecs Service
       */
      this.service = new Service(this, "Ecs-Service", {
         cluster: this.cluster,
         taskDefinition: this.taskDef,
         serviceName: this.applicationName,
      });

      /**
       *
       * Serivce Connections
       */
      this.service.connections.allowFrom(props.elb, ec2.Port.tcp(80));
      this.service.connections.allowFrom(props.elb, ec2.Port.tcp(8080));
      this.service.attachToApplicationTargetGroup(this.targetGroups.blueGroup);
   }
}
