import "./services/resource-management-api.service.mock";
import "./services/foward-api.service.mock";

jest.mock("next/router", () => require("next-router-mock"));
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn().mockReturnValue(jest.fn().mockReturnValue({})),
}));
