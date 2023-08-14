import {
  mockElementoProgramado,
  mockQuirofanoData,
} from "./object-models.mock";

jest.mock(
  "../../core/services/forward-api-typescript-fetch/forward-api.service",
  () => ({
    forwardMesaDeProgramacionApi: {
      queryElementoProgramado: jest
        .fn()
        .mockReturnValue([mockElementoProgramado]),
    },
    forwardCoreApi: {
      getQuirofanos: jest.fn().mockReturnValue([mockQuirofanoData]),
    },
  })
);
