import yargs from "yargs"
import generator from "./generator"
import scanner from "./scanner"

import { hideBin } from "yargs/helpers"

const cli = () => {
    return yargs()
        .scriptName("rapps")
        .usage("$0 <cmd>")
        .command('scan', 'Scanning apps from developers and adding them to apps.json ', () => null,
            (argv) => {
                console.log("Start scanning the developers pages...")
                scanner.scan()
            }
        )
        .command('generate', 'Generate files for Happ & Clash Mihomo from apps.json',
            (yargs) => {
                return yargs.options(
                    {
                        'type': { describe: "Type of generated file", type: "string", choices: ["mihomo", "happ-server", "happ-client", "all"], default: "all" }
                    }
                )
            },
            (argv) => {
                switch (argv.type) {
                    case "mihomo":
                        console.log("Generating rule provider file for Clash Mihomo...")
                        generator.generateMihomoFile()
                        break;
                    case "happ-server":
                        console.log("Generating server headers for Happ...")
                        generator.generateHappServerFile()
                        break;
                    case "happ-client":
                        console.log("Generating apps list for Happ...")
                        generator.generateHappUserFile()
                        break;
                    case "all":
                        console.log("Generating files...")
                        generator.generateAll()
                        break;
                    default:
                        console.error("Unknown type")
                        break;
                }
            }
        )
        .help()
        .parse(hideBin(process.argv))
}

export default cli