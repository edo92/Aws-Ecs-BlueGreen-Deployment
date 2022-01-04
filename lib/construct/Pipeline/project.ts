import * as cdk from "@aws-cdk/core";
import * as ecr from "@aws-cdk/aws-ecr";
import * as iam from "@aws-cdk/aws-iam";
import * as codebuild from "@aws-cdk/aws-codebuild";

export interface IVariables {
   environmentVariables?: {
      [key: string]: {
         value?: string;
         type?: codebuild.BuildEnvironmentVariableType;
      };
   };
}

interface Options extends IVariables {
   timeout?: cdk.Duration;
   buildSpec?: codebuild.BuildSpec;
   computeType?: codebuild.ComputeType;
   buildImage?: codebuild.LinuxBuildImage;
   role?: iam.Role;
}

export interface ITaskContainers {
   ecrImage: ecr.IRepository;
}

export interface ProjectProps extends Options {
   region: string;
   account: string;
   familyName: string;
   grantAccess?: ITaskContainers[];
}

class DefaultOptions {
   public static timeout = cdk.Duration.minutes(15);
   public static computeType: codebuild.ComputeType.SMALL;
   public static buildImage = codebuild.LinuxBuildImage.STANDARD_4_0;
   public static buildSpec = codebuild.BuildSpec.fromSourceFilename("buildspec.yml");
}

export class Project extends codebuild.PipelineProject {
   constructor(scope: cdk.Construct, id: string, props: ProjectProps) {
      super(scope, id, {
         role: props.role,
         timeout: props.timeout || DefaultOptions.timeout,
         buildSpec: props.buildSpec || DefaultOptions.buildSpec,
         checkSecretsInPlainTextEnvVariables: true,

         environment: {
            privileged: true,
            computeType: props.computeType || DefaultOptions.computeType,
            buildImage: props.buildImage || DefaultOptions.buildImage,
         },

         environmentVariables: {
            ...(props.environmentVariables || {}),
            AWS_ACCOUNT_ID: { value: props.account },
            AWS_DEFAULT_REGION: { value: props.region },
            TASK_FAMILY: { value: props.familyName },
         },
      });

      // Project pipeline grants repository access
      props.grantAccess?.forEach((item) => {
         item.ecrImage.grantPullPush(this);
      });
   }
}
