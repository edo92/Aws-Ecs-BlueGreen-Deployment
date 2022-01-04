export interface DeploymentConfigProps {
   region: string;
   account: string;
   resourceName: string;
}

class DeploymentOptions {
   public static all_At_once = "AllAtOnce";
   public static ecs_10_every_minute = "ECSLinear10PercentEvery1Minutes";
}

export class DeploymentConfig extends DeploymentOptions {
   public readonly deploymentConfigArn: string;
   public readonly deploymentConfigName: string;

   private get configArn(): string {
      const service = `arn:aws:codedeploy`;
      const account = `${this.props.region}:${this.props.account}`;
      const resource = `deploymentconfig:CodeDeployDefault.${this.props.resourceName}`;
      return `${service}:${account}:${resource}`;
   }

   constructor(private props: DeploymentConfigProps) {
      super();

      if (!this.props.resourceName) throw new Error("Resource Name is undefined");
      this.deploymentConfigName = `CodeDeployDefault.${this.props.resourceName}`;
      this.deploymentConfigArn = this.configArn;
   }
}
