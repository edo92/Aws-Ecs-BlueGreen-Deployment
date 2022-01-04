import * as config from "@config";
import * as cdk from "@aws-cdk/core";
import { Resources } from "@pattern/Resources";
import { EcsService } from "@pattern/EcsService";
import { Pipeline } from "./pipeline";

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
      const ecsService = new EcsService(this, "Ecs-Service", {
         vpc: resources.vpc,
         elb: resources.loadBalancer,
         names: config.resource_names,
      });

      /**
       *
       * Pipeline
       */
      new Pipeline(this, "Service-Pipeline", {
         region: this.region,
         account: this.account,
         service: ecsService,
         names: config.resource_names,
         github: config.project_source,
      });
   }
}
