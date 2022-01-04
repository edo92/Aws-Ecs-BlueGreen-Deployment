import * as cdk from "@aws-cdk/core";
import * as cloudWatch from "@aws-cdk/aws-cloudwatch";

export class BlueGreenAlarms extends cdk.Construct {
   public readonly blueGroupAlarm: cloudWatch.Alarm;
   public readonly greenGroupAlarm: cloudWatch.Alarm;

   constructor(scope: cdk.Construct, id: string) {
      super(scope, id);

      /**
       *
       * Blue Metric/Alarm
       *
       */
      const blueGroupMetric = new cloudWatch.Metric({
         namespace: "AWS/ApplicationELB",
         metricName: "HTTPCode_Target_4XX_Count",
         dimensionsMap: {
            TargetGroup: "targetgroup/Blue-Group/c636ee69f1c01097",
            LoadBalancer: "app/Ecs-P-AppLo-EOZKIEO7PC8G/2623aa771c10760a",
         },
         statistic: cloudWatch.Statistic.SUM,
         period: cdk.Duration.minutes(1),
      });

      this.blueGroupAlarm = new cloudWatch.Alarm(this, "blue4xxErrors", {
         alarmName: "Blue_4xx_Alarm",
         alarmDescription: "CloudWatch Alarm for the 4xx errors of Blue target group",
         metric: blueGroupMetric,
         threshold: 1,
         evaluationPeriods: 1,
      });

      /**
       *
       * Green Metric/Alarm
       *
       */
      const greenGroupMetric = new cloudWatch.Metric({
         namespace: "AWS/ApplicationELB",
         metricName: "HTTPCode_Target_4XX_Count",
         dimensionsMap: {
            TargetGroup: "targetgroup/Green-Group/bdb11d27439c803e",
            LoadBalancer: "app/Ecs-P-AppLo-EOZKIEO7PC8G/2623aa771c10760a",
         },
         statistic: cloudWatch.Statistic.SUM,
         period: cdk.Duration.minutes(1),
      });

      this.greenGroupAlarm = new cloudWatch.Alarm(this, "green4xxErrors", {
         alarmName: "Green_4xx_Alarm",
         alarmDescription: "CloudWatch Alarm for the 4xx errors of Green target group",
         metric: greenGroupMetric,
         threshold: 1,
         evaluationPeriods: 1,
      });
   }
}
