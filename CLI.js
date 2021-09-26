const Runtime = process;

import * as Reader from "readline";

import * as PUT from "./PUT.js";

const Parameter = {};

/*****
 *
 * @param input
 * @param _
 * @constructor
 *
 */

//const Usage = (input, _) => {
//    _(null, [[
//        ... Users.Callable,
//        ... Repositories.Callable,
//        ... Package.Callable
//    ], input]);
//};

const Usage = (input, _) => {
    _(null, [[
        ... ["put"]
    ], input]);
};

/******
 *
 * @param key
 * @param prompt
 * @param callback
 *
 * @returns {Promise<void>}
 *
 * @constructor
 *
 */

const Await = async (key, prompt, callback = null) => {
    const $ = Reader.createInterface({
        input: Runtime.stdin,
        output: Runtime.stdout,
        terminal: false,
        prompt
    });

    $.prompt();

    $.on("line", async (stream) => {
        switch (stream.trim()) {
            case "":
                Runtime.stdout.write(["  ↳ Error: Invalid Input", " ",
                    "(\"", stream.trim(), "\")",
                    "\n", "\n"
                ].join(""));

                break;
            default:
                if (stream.trim().toLowerCase() === "true") {
                    Parameter[key] = true;
                } else if (stream.trim().toLowerCase() === "false") {
                    Parameter[key] = false;
                } else {
                    Parameter[key] = stream.trim();
                }

                $.close();
        }
    });

    await $.on("close", async () => {
        console.debug("\n" + JSON.stringify(Parameter, null, 4) + "\n");
        (!callback) ? $.close()
            : await callback();
    });
};

/*****
 *
 * @returns {Promise<void>}
 * @constructor
 *
 */

const Prompt = async () => {
    await Await("Name", "[SSM] (Name): ",
        async () => await Await("Description", "[SSM] (Description): ",
            async () => await Await("Overwrite", "[SSM] (Overwrite): ",
                async () => await Await("Secure", "[SSM] (Encrypted): ",
                    async () => await Await("Value", "[SSM] (Value): ",
                        async () => {
                            await PUT.Main(Parameter);
                        }
                    )
                )
            )
        )
    );
};

const Main = async () => {
    await Prompt();
};

await Main();
