import { barcodeDeviceKeyDownEventHandler } from "./barcode-device-input-parser.utils";

const generateEvent = (key: string) => new KeyboardEvent("keydown", { key });

describe("barcodeDeviceKeyDownEventHandler", () => {
  it("Should add new key to input string", () => {
    const baseString = "";
    const event = generateEvent("a");
    const res = barcodeDeviceKeyDownEventHandler(
      event as unknown as React.KeyboardEvent,
      baseString
    );
    expect(res).toBe(`${baseString}${event.key}`);
  });

  it("Should clean special characters adn add a space when Enter is played ", () => {
    const baseString = "ShiftAShiftBShiftC";
    const event = generateEvent("Enter");
    const res = barcodeDeviceKeyDownEventHandler(
      event as unknown as React.KeyboardEvent,
      baseString
    );
    expect(res).toBe("ABC ");
  });

  it("Should clean special characters and add a space when Enter is played ", () => {
    const baseString = "ShiftAShiftBShiftC";
    const event = generateEvent("Enter");
    const res = barcodeDeviceKeyDownEventHandler(
      event as unknown as React.KeyboardEvent,
      baseString
    );
    expect(res).toBe("ABC ");
  });

  it("Should clean up GS1-128-FNC1  when Enter is pressed", () => {
    let baseString = "Control]ABC";
    const event = generateEvent("Enter");
    let res = barcodeDeviceKeyDownEventHandler(
      event as unknown as React.KeyboardEvent,
      baseString
    );
    expect(res).toBe(" ABC ");

    baseString = "Control+ABC";
    res = barcodeDeviceKeyDownEventHandler(
      event as unknown as React.KeyboardEvent,
      baseString
    );
    expect(res).toBe(" ABC ");
  });

  it("Should remove a char when Backspace key is recieved", () => {
    const baseString = "ABC";
    const event = generateEvent("Backspace");
    const res = barcodeDeviceKeyDownEventHandler(
      event as unknown as React.KeyboardEvent,
      baseString
    );
    expect(res).toBe("AB");
  });
});
