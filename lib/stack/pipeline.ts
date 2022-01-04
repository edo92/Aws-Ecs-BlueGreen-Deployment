import * as types from "types";
import * as cdk from "@aws-cdk/core";
import { Deployment } from "@pattern/CodeDeploy";
import { ProjectPipeline } from "@pattern/Pipeline";
import { IEcsService } from "@pattern/EcsService";

interface PipelineProps {
   region: string;
   account: string;
   names: types.INames;
   github: types.IGithub;
   service: IEcsService;
}

export class Pipeline extends cdk.Construct {
   constructor(scope: cdk.Construct, id: string, props: PipelineProps) {
      super(scope, id);

      /**
       *
       * CodeDeploy blue/green depoyment
       */
      const codedeploy = new Deployment(this, "Codedeploy-Deployment", {
         region: props.region,
         account: props.account,

         listeners: props.service.listeners,
         targetGroups: props.service.targetGroups,

         clusterName: props.names.clusterName,
         applicationName: props.names.applicationName,
      });

      /**
       *
       * Project Pipeline service env vars
       */
      const environmentVariables = {
         FAMILY: { value: props.service.taskDef.family },
         TASK_ARN: { value: props.service.taskDef.taskRole?.roleArn },
         TASK_EXEC_ARN: { value: props.service.taskDef.executionRole?.roleArn },
      };

      /**
       *
       * Project Pipeline with actions
       */
      const pipeline = new ProjectPipeline(this, "Project-Pipeline", {
         region: props.region,
         account: props.account,

         environmentVariables,
         github: props.github,

         familyName: props.names.applicationName,
         taskContainers: props.service.taskDef.taskContainers,
         deploymentGroup: codedeploy.deployment.deploymentGroup,
      });

      /**
       *
       * Stack Dependency
       */
      pipeline.node.addDependency(codedeploy);
   }
}
