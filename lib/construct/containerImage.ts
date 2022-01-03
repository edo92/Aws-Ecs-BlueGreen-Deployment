import * as cdk from "@aws-cdk/core";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecr from "@aws-cdk/aws-ecr";

export interface IContainerImage {
   readonly image: ecs.ContainerImage;
   readonly repository: ecr.IRepository;
}

export interface ImageProps {
   tagName: string;
   repoName: string;
}

export class ContainerImage implements IContainerImage {
   public readonly image: ecs.ContainerImage;
   public readonly repository: ecr.IRepository;

   constructor(scope: cdk.Construct, id: string, props: ImageProps) {
      /**
       *
       * Get Repository
       */
      const repoId = `${id}-${props.repoName}-${props.tagName}`;
      this.repository = ecr.Repository.fromRepositoryName(scope, repoId, props.repoName);

      /**
       *
       * Get Repo Image
       */
      this.image = ecs.ContainerImage.fromEcrRepository(this.repository, props.tagName);
   }
}
