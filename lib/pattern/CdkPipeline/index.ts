import * as types from "@types";
import * as cdk from "@aws-cdk/core";
import * as codebuild from "@aws-cdk/aws-codebuild";
import * as codepipeline from "@aws-cdk/aws-codepipeline";
import * as pipelineActions from "@aws-cdk/aws-codepipeline-actions";

import { CdkProjectRole } from "./role";
import { Buildspec } from "./buildspec";

interface CdkPipelineProps {
   github: types.IGithub;
}

export class CdkPipeline extends cdk.Construct {
   public readonly project: codebuild.PipelineProject;
   public readonly buildArtifact: codepipeline.Artifact;
   public readonly sourceArtifact: codepipeline.Artifact;

   constructor(scope: cdk.Construct, id: string, props: CdkPipelineProps) {
      super(scope, id);
      /**
       *
       * Cdk pipeline role
       */
      const pipelineRole = new CdkProjectRole(this, "CdkPipeline-Role");

      /**
       *
       * Pipeline artifacts
       */
      this.buildArtifact = new codepipeline.Artifact();
      this.sourceArtifact = new codepipeline.Artifact();

      /**
       *
       * Project Pipeline
       */
      this.project = new codebuild.PipelineProject(this, "Project", {
         projectName: `Project`,
         role: pipelineRole,
         buildSpec: new Buildspec().script,
         environment: {
            computeType: codebuild.ComputeType.SMALL,
            buildImage: codebuild.LinuxBuildImage.STANDARD_2_0,
         },
      });

      /**
       *
       * Source Action
       */
      const sourceAction = new pipelineActions.GitHubSourceAction({
         actionName: "GitHub-Source",
         output: this.sourceArtifact,
         repo: props.github.repo,
         owner: props.github.owner,
         branch: props.github.branch,
         oauthToken: cdk.SecretValue.secretsManager(props.github.secretToken),
      });

      /**
       *
       * Build Action
       */
      const buildAction = new pipelineActions.CodeBuildAction({
         actionName: "GitHub-Source",
         project: this.project,
         input: this.sourceArtifact,
         outputs: [this.buildArtifact],
      });

      /**
       *
       * Cdk Codepipeline
       */
      new codepipeline.Pipeline(this, "Cdk-Pipeline", {
         pipelineName: "Cdk-Pipeline",
         stages: [
            {
               stageName: "Source",
               actions: [sourceAction],
            },
            {
               stageName: "BuildAction",
               actions: [buildAction],
            },
         ],
      });
   }
}
