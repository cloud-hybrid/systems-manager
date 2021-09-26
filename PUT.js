import AWS from "aws-sdk";

const Arguments = process.argv.splice(2);

const Profile = (Arguments[Arguments.indexOf("--profile") + 1])
    ? Arguments[Arguments.indexOf("--profile") + 1]
        : "default";

const Credentials = new AWS.SharedIniFileCredentials({ profile: Profile });

AWS.config.credentials = Credentials;

import { SSM } from "@aws-sdk/client-ssm";

/*****
 *
 * @param Name
 * @param Description
 * @param Overwrite
 * @param Value
 * @param Secure
 *
 * @returns {{Overwrite, Type: (string), Description, Tier: string, Value, Name}}
 *
 * @constructor
 *
 */

const Options = ({ Name, Description, Overwrite, Value, Secure }) => {
    return {
        Name, Description, Value, Overwrite,
        Type: (Secure) ? "SecureString" : "String",
        Tier: "Standard"
    };
};

/*****
 *
 * @returns {Promise<{}>}
 *
 * @constructor
 *
 */

const Request = async (data) => {
    const Response = {};

    const API = new SSM({
        region: "us-east-2", tls: true
    });

    const Input = Options(data);

    await API.putParameter(
        { ... Input }, (error, data) => {
        Response.Data = (data) ? data : null;
        Response.Error = {
            Exception: error.name,
            Status: error.$metadata.httpStatusCode,
            Fault: error.$fault
        };

        console.debug(
            JSON.stringify(Response, null, 4) + "\n"
        );

        return Response;
    });
};

/*****
 *
 * @returns {Promise<{}>}
 * @constructor
 *
 * @param data
 *
 */

export const Main = async (data) => {
    return await Request(data);
};

export default Main;
