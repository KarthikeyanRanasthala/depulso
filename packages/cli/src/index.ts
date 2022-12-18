#!/usr/bin/env node

import { Command } from "commander";

import { version } from "../package.json";

import { onDeploy } from "./actions/deploy";
import { onInit } from "./actions/init";
import { onLogin } from "./actions/login";
import { onLogout } from "./actions/logout";

const program = new Command();

program.version(version);

program.command("login").description("Logs into your account").action(onLogin);

program
  .command("init", { isDefault: true })
  .description("Inits a new project")
  .action(onInit);

program
  .command("deploy")
  .description("Deploys the current project")
  .action(onDeploy);

program
  .command("logout")
  .description("Logs out of your account")
  .action(onLogout);

program.parse(process.argv);
