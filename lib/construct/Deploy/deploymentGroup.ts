import * as cdk from "@aws-cdk/core";
import * as cloudWatch from "@aws-cdk/aws-cloudwatch";
import * as elb from "@aws-cdk/aws-elasticloadbalancingv2";

interface IAlarms {
   blueGroupAlarm: cloudWatch.Alarm;
   greenGroupAlarm: cloudWatch.Alarm;
}

export interface IListeners {
   prodListener: elb.ApplicationListener;
   testListener: elb.ApplicationListener;
}

export interface ITargetGroups {
   blueTargetGroupName: string;
   greenTargetGroupName: string;
}

interface IResources {
   alarms: IAlarms;
   listeners: IListeners;
   targetGroups: ITargetGroups;
}

interface ResourceNames {
   clusterName: string;
   applicationName: string;
   deploymentConfigName: string;
}

export interface ApplicationProps extends ResourceNames, IResources {
   functionArn: string;
   serviceRoleArn: string;
   terminationWaitTime?: number;
}

export class DeploymentGroup extends cdk.CustomResource {
   constructor(scope: cdk.Construct, id: string, props: ApplicationProps) {
      super(scope, id, {
         serviceToken: props.functionArn,

         properties: {
            ApplicationName: props.applicationName,
            DeploymentGroupName: props.applicationName,
            DeploymentConfigName: props.deploymentConfigName,

            ServiceRoleArn: props.serviceRoleArn,
            BlueTargetGroup: props.targetGroups.blueTargetGroupName,
            GreenTargetGroup: props.targetGroups.greenTargetGroupName,

            ProdListenerArn: props.listeners.prodListener.listenerArn,
            TestListenerArn: props.listeners.testListener.listenerArn,

            EcsClusterName: props.clusterName,
            EcsServiceName: props.applicationName,

            BlueGroupAlarm: props.alarms.blueGroupAlarm.alarmName,
            GreenGroupAlarm: props.alarms.greenGroupAlarm.alarmName,
            TerminationWaitTime: props.terminationWaitTime || 5,
         },
      });
   }
}
