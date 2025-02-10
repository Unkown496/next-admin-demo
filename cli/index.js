import { Command } from "commander";

const cli = new Command();

import helpCmd from "./commands/help.js";
import makeCmd from "./commands/make.js";

cli
  .name("next-admin cli")
  .description("Little helper for next.js+admin.js apps")
  .version("0.0.1");

[helpCmd, makeCmd].forEach(cmd => cmd(cli));

cli.parse(process.argv);
