#!/usr/bin/env node

import { Command } from "commander";
import { version } from "../package.json";

const program = new Command();

program.version(version);

program
  .command("login")
  .description("Logs into your account")
  .action(() => console.log("Login"));

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
  .action(() => console.log("Logout"));

program.parse(process.argv);
