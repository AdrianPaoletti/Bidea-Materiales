import { formatDateHourToBackend } from "./format-date.utils";

describe("date utils", () => {
  it("Should do something", () => {
    const now = new Date(2000, 1, 1, 1, 1);
    now.setUTCHours(0, 0, 0);
    const formated = formatDateHourToBackend(now);
    expect(new Date(formated).getUTCHours()).toBe(0);
  });
});
