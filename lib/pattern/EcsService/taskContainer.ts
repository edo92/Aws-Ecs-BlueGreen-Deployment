import * as cdk from "@aws-cdk/core";
import { Container, IContainer } from "@construct/container";

export interface ContainerProps {
   appName: string;
}

export class TaskContainer extends cdk.Construct {
   private _containers: IContainer[];

   public get allContainers() {
      // eslint-disable-next-line no-underscore-dangle
      return this._containers;
   }

   public registerContainer(containers: IContainer[]) {
      // eslint-disable-next-line no-underscore-dangle
      this._containers = containers;
   }

   constructor(scope: cdk.Construct, id: string, props: ContainerProps) {
      super(scope, id);

      /**
       *
       * Express Container
       */
      const expressContainer = new Container(this, "sampleAppContainer", {
         cpu: 1,
         containerPort: 80,
         memoryLimitMiB: 512,
         applicationName: props.appName,
         image: Container.image("backend", "latest"),
      });

      this.registerContainer([expressContainer]);
   }
}
