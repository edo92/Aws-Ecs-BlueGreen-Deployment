import * as cdk from "@aws-cdk/core";
import * as ecr from "@aws-cdk/aws-ecr";
import * as ecs from "@aws-cdk/aws-ecs";
import { ContainerImage, ImageProps } from "./containerImage";

interface ConfigSpecs {
   cpu: number;
   memoryLimitMiB: number;
}

interface ResourceNames {
   applicationName: string;
}

interface IPortMapping {
   protocol?: ecs.Protocol;
   containerPort: number;
}

interface IConfig extends ConfigSpecs {
   containerName: string;
   image: ecs.ContainerImage;
   dockerLabels: { name: string };
}

export interface IContainer extends ResourceNames {
   containerName: string;
   containerConfig: IConfig;
   portMapping: IPortMapping;
   ecrImage: ecr.IRepository;
}

export interface ContainerProps extends IPortMapping, ConfigSpecs, ResourceNames {
   image: ImageProps;
}

export class Container implements IContainer {
   public readonly containerName: string;
   public readonly applicationName: string;
   public readonly containerConfig: IConfig;
   public readonly portMapping: IPortMapping;
   public readonly ecrImage: ecr.IRepository;

   constructor(scope: cdk.Construct, id: string, props: ContainerProps) {
      const image = new ContainerImage(scope, id, props.image);

      this.ecrImage = image.repository;

      this.containerConfig = {
         image: image.image,
         cpu: props.cpu,
         memoryLimitMiB: props.memoryLimitMiB,

         containerName: id,
         dockerLabels: {
            name: props.applicationName,
         },
      };

      this.portMapping = {
         containerPort: props.containerPort,
         protocol: props.protocol || ecs.Protocol.TCP,
      };

      this.containerName = id;
      this.applicationName = props.applicationName;
   }

   public static image(repoName: string, tagName: string): ImageProps {
      return { repoName, tagName };
   }
}
