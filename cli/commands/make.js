import { writeFile, readFile } from "fs/promises";
import { resolve } from "path";

import ora from "ora";

const pathPackageJson = resolve("./package.json"),
  inPathGenerateDir = (...paths) => resolve("./generate", ...paths);

/** @type {(programmCli: import("commander").Command) => import("commander").Command } */
export default programmCli => {
  return programmCli
    .command("make:generate")
    .argument("<name>", "name of generate command without extension")
    .action(async name => {
      const load = ora("Creating generate command!");

      const packageJSON = JSON.parse(await readFile(pathPackageJson));

      if (packageJSON.scripts[`generate:${name}`])
        return console.error(`Generator ${name} is exist!`);

      packageJSON.scripts[`generate:${name}`] = `node ./generate/${name}.js`;

      load.text = "Writting package.json";

      await writeFile(
        inPathGenerateDir(`${name}.js`),
        `(() => console.log('create ${name} generate!')))()`
      );

      load.text = "Generate js file of generator";

      await writeFile(pathPackageJson, JSON.stringify(packageJSON));

      load.stopAndPersist({ text: "Successfily added new generate!" });
    });
};
