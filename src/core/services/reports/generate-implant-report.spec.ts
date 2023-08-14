import { implantReport } from "./generate-implant-report";

jest.mock("@ikusi/surgery-reporting", () => ({
  generateImplantReport: jest.fn(),
}));
const createElementSpy = jest.spyOn(document, "createElement");
const appendChildSpy = jest.spyOn(document.body, "appendChild");
const removeChildSpy = jest.spyOn(document.body, "removeChild");
const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, "click");

describe("Given a generateImplantReport function", () => {
  beforeAll(async () => {
    window.URL.createObjectURL = jest.fn();

    await implantReport({
      interventionRequestCode: 1,
      interventionHub: "1",
      fileName: "Test",
      lang: "es",
      withPatient: true
    });
  });

  describe("When is invoked", () => {
    test("Then it should call createElement method with an 'a' tag and appended into the body", () => {
      expect(createElementSpy).toHaveBeenCalledWith("a");
      expect(appendChildSpy).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalledWith(
        expect.any(HTMLAnchorElement)
      );
    });

    test("Then it should fire the download click event and call the removeChild method", () => {
      const anchorElement = appendChildSpy.mock.calls[0][0] as HTMLElement;

      anchorElement.click();

      expect(clickSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalledWith(
        expect.any(HTMLAnchorElement)
      );
    });
  });
});
