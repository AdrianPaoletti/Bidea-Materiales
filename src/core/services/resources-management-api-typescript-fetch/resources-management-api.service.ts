import {
  Configuration,
  CoreApi,
  GestinDeIntervencionesApi,
  GestinDelCatlogoApi,
  LecturasDeCdigoDeBarrasApi,
  PredictorApi,
  RecursosApi,
  ReservasApi,
  SeguimientoDeMaterialesApi,
} from "@ikusi/resources-management-api-typescript-fetch";

const configurationVariables: {
  basePath?: string;
  accessToken?: string;
} =
  typeof window !== "undefined"
    ? {
        basePath: process.env.NEXT_PUBLIC_MATERIALS_API,
        accessToken: localStorage.getItem("token") || undefined,
      }
    : {};
const configuration = new Configuration(configurationVariables);

const interventionsManagementApi = new GestinDeIntervencionesApi(configuration);
const resourcesApi = new RecursosApi(configuration);
const barCodeReadingApi = new LecturasDeCdigoDeBarrasApi(configuration);
const followedMaterialsApi = new SeguimientoDeMaterialesApi(configuration);
const reservationsApi = new ReservasApi(configuration);
const coreAPi = new CoreApi(configuration);
const catalogApi = new GestinDelCatlogoApi(configuration);
const predictorApi = new PredictorApi(configuration);

export {
  interventionsManagementApi,
  resourcesApi,
  barCodeReadingApi,
  followedMaterialsApi,
  reservationsApi,
  coreAPi,
  catalogApi,
  predictorApi,
};
