/**
 * Builds a valid code reading from barcodeReaderDevice KeyDown Events.
 * - Adds all eventKeys to a string,
 * - When Enter key is found, cleans up GS1-128-FNC1 ("Ctrl" + ["]" | "+"] ) replacing them by a space.
 * https://support.idautomation.com/Barcode-FAQ/What-is-an-FNC1-character/_1108
 * - Additionally, cleans Enter and Shift (pressed for UpperCase characters)
 * @param keyDownEvent keydown event
 */
export const barcodeDeviceKeyDownEventHandler = (
  keyDownEvent: React.KeyboardEvent,
  barcodeString: string
) => {
  keyDownEvent.stopPropagation();
  keyDownEvent.preventDefault();
  if (keyDownEvent.key === "Backspace") {
    barcodeString = barcodeString.slice(0, -1);
    return barcodeString;
  }
  barcodeString += keyDownEvent.key;

  if (keyDownEvent.key === "Enter") {
    barcodeString += " ";
    barcodeString = barcodeString.replace(/Enter/g, "");
    barcodeString = barcodeString.replace(/Control\]/g, " ");
    barcodeString = barcodeString.replace(/Control\+/g, " ");
    barcodeString = barcodeString.replace(/Shift/g, "");
  }
  return barcodeString;
};
