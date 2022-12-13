#!/usr/bin/env node

import { Command } from "commander";

import { version } from "../package.json";
import { onLogin } from "./login";
import { onLogout } from "./logout";

const program = new Command();

program.version(version);

program
  .command("login")
  .description("Logs into your account")
  .action(() => onLogin());

program
  .command("init")
  .description("Inits a new project")
  .action(() => console.log("Init"));

program
  .command("deploy")
  .description("Deploys the current project")
  .action(() => console.log("Deploy"));

program
  .command("logout")
  .description("Logs out of your account")
  .action(() => onLogout());

program.parse(process.argv);
