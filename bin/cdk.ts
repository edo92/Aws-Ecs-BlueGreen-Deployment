#!/usr/bin/env node
import "tsconfig-paths/register";
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { Infrastructure } from "@stack";

const app = new cdk.App();
new Infrastructure(app, "App-Infrastructure");
