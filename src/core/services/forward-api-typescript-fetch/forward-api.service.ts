import {
  Configuration,
  GeneralApi,
  MesaDeProgramacionApi,
} from "@ikusi/forward-api-typescript-fetch";

const configurationVariables: {
  basePath?: string;
  accessToken?: string;
} =
  typeof window !== "undefined"
    ? {
        basePath: process.env.NEXT_PUBLIC_FORWARD_API,
        accessToken: localStorage.getItem("token") || undefined,
      }
    : {};

const configuration = new Configuration(configurationVariables);

const forwardCoreApi = new GeneralApi(configuration);
const forwardMesaDeProgramacionApi = new MesaDeProgramacionApi(configuration);

export { forwardCoreApi, forwardMesaDeProgramacionApi };
