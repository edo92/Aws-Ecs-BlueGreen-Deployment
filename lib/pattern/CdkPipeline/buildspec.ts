import * as codebuild from "@aws-cdk/aws-codebuild";

export class Buildspec {
   public get script(): codebuild.BuildSpec {
      return codebuild.BuildSpec.fromObject({
         version: "0.2",
         phases: {
            install: {
               commands: ["npm install"],
            },
            build: {
               commands: ["npx cdk synth", "npx cdk deploy --all --require-approval=never"],
            },
         },
      });
   }
}
