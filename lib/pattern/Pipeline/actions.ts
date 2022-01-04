import * as types from "@types";
import * as cdk from "@aws-cdk/core";
import * as codebuild from "@aws-cdk/aws-codebuild";
import * as codedeploy from "@aws-cdk/aws-codedeploy";
import * as codepipeline from "@aws-cdk/aws-codepipeline";
import * as pipelineActions from "@aws-cdk/aws-codepipeline-actions";
import { PolicyStatement } from "@aws-cdk/aws-iam";

export interface PipelineActionsProps {
   github: types.IGithub;
   project: codebuild.PipelineProject;
   deploymentGroup: codedeploy.IEcsDeploymentGroup;
}

export class PipelineActions extends cdk.Construct {
   public readonly buildAction: pipelineActions.CodeBuildAction;
   public readonly sourceAction: pipelineActions.GitHubSourceAction;
   public readonly deployAction: pipelineActions.CodeDeployEcsDeployAction;

   constructor(scope: cdk.Construct, id: string, props: PipelineActionsProps) {
      super(scope, id);

      /**
       *
       * Project build artifacts
       */
      const buildArtifact = new codepipeline.Artifact();
      const sourceArtifact = new codepipeline.Artifact();

      /**
       *
       * Source Action
       */
      this.sourceAction = new pipelineActions.GitHubSourceAction({
         actionName: "GitHub-Source",
         output: sourceArtifact,
         repo: props.github.repo,
         owner: props.github.owner,
         branch: props.github.branch,
         oauthToken: cdk.SecretValue.secretsManager(props.github.secretToken),
      });

      /**
       *
       * Build Action
       */
      this.buildAction = new pipelineActions.CodeBuildAction({
         actionName: "Deployment",
         project: props.project,
         input: sourceArtifact,
         outputs: [buildArtifact],
      });

      /**
       *
       * Deployment Acton
       */
      this.deployAction = new pipelineActions.CodeDeployEcsDeployAction({
         actionName: "Ecs-Deployment-Action",
         deploymentGroup: props.deploymentGroup,

         appSpecTemplateInput: buildArtifact,
         taskDefinitionTemplateInput: buildArtifact,
         containerImageInputs: [
            {
               input: buildArtifact,
               taskDefinitionPlaceholder: "TASK_DEFINITION",
            },
         ],
      });

      this.deployAction.actionProperties.role?.addToPrincipalPolicy(
         new PolicyStatement({
            actions: ["ecr:*", "ecs:*", "sts:*", "iam:*"],
            resources: ["*"],
         })
      );
   }
}
