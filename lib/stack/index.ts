import * as config from "@config";
import * as cdk from "@aws-cdk/core";
import { Resources } from "@pattern/Resources";
import { EcsService } from "@pattern/EcsService";

export class Infrastructure extends cdk.Stack {
   constructor(scope: cdk.Construct, id: string) {
      super(scope, id);

      /**
       *
       * Base Resources
       */
      const resources = new Resources(this, "Base-Resources");

      /**
       *
       * Ecs Service
       */
      new EcsService(this, "Ecs-Service", {
         vpc: resources.vpc,
         elb: resources.loadBalancer,
         names: config.resource_names,
      });
   }
}
