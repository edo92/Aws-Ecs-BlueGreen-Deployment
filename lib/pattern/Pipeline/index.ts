import * as cdk from "@aws-cdk/core";
import * as codedeploy from "@aws-cdk/aws-codedeploy";
import * as codepipeline from "@aws-cdk/aws-codepipeline";
import { Project, IVariables, ITaskContainers } from "@construct/Pipeline/project";

import { ProjectRole } from "./role";
import { PipelineActions } from "./actions";

interface ResourceNames {
   familyName: string;
   deploymentGroup: codedeploy.IEcsDeploymentGroup;
}

interface PipelineProps extends ResourceNames, IVariables {
   region: string;
   account: string;
   github: IGithub;
   taskContainers: ITaskContainers[];
}

export class ProjectPipeline extends cdk.Construct {
   public readonly project: Project;
   public readonly pipeline: codepipeline.Pipeline;

   constructor(scope: cdk.Construct, id: string, props: PipelineProps) {
      super(scope, id);

      /**
       *
       * Codebuild project role
       */
      const projectRole = new ProjectRole(this, "Project-Role");

      /**
       *
       * Project Pipeline
       */
      this.project = new Project(this, "Project-Pipeline", {
         role: projectRole,
         region: props.region,
         account: props.account,
         familyName: props.familyName,
         grantAccess: props.taskContainers,
         environmentVariables: props.environmentVariables,
      });

      /**
       *
       * Project pipeline actions
       */
      const actions = new PipelineActions(this, "ProjectPipeline-Actions", {
         github: props.github,
         project: this.project,
         deploymentGroup: props.deploymentGroup,
      });

      /**
       *
       * Pipeline
       */
      this.pipeline = new codepipeline.Pipeline(this, "Pipeline-Stage", {
         pipelineName: "pipeline",
         stages: [
            {
               stageName: "Source",
               actions: [actions.sourceAction],
            },
            {
               stageName: "Build",
               actions: [actions.buildAction],
            },
            {
               stageName: "Deploy",
               actions: [actions.deployAction],
            },
         ],
      });
   }
}
