import { styleText } from "node:util";

const generateCommand = text => styleText("yellow", text),
  makeCommand = text => styleText("cyan", text);

/**
 *
 * @param {import("commander").Command} programmCli
 */
export default programmCli =>
  programmCli
    .command("help")
    .description("Get list of command and short desc of that")
    .action(() => {
      const listOfCmds = {
        generate: {
          [generateCommand("generate:admin")]:
            "Generate one record of admin (have password and login)",
        },
        make: {
          [makeCommand("make:generate <name_file>")]:
            "Create skeleton file for generate and add this in package",
        },
      };

      console.log("All Commands: \n");

      console.log(`All ${generateCommand("generate")} commands: \n`);

      console.log(
        Object.entries(listOfCmds.generate)
          .map(([nameOfCmd, descOfCmd]) => `${nameOfCmd} - ${descOfCmd} \n`)
          .join()
      );

      console.log(`All ${makeCommand("make")} commands: \n`);
      console.log(
        Object.entries(listOfCmds.make)
          .map(([nameOfCmd, descOfCmd]) => `${nameOfCmd} - ${descOfCmd} \n`)
          .join()
      );
    });
