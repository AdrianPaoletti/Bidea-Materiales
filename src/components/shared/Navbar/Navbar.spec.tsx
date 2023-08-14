import { act } from "react-dom/test-utils";

import { fireEvent, render, screen } from "@testing-library/react";

import i18n from "resources-management/statics/locales/i18n";
import Navbar, { NavbarProps } from "./Navbar";

const navbarProps: NavbarProps = {
  tabValue: "test_label_1",
  setTabValue: jest.fn(),
  materialsItemsLabels: ["test_label_1", "test_label_2"],
};

describe("Given a Navbar component", () => {
  beforeEach(() => {
    render(<Navbar {...navbarProps} />);

    act(() => {
      i18n.init();
    });
  });

  describe("When is rendered", () => {
    test("Then it should render the tabValue provided to the component", () => {
      const tabOne = screen.getAllByRole("tab")[0];

      expect(tabOne.innerHTML.split("<")[0]).toEqual(navbarProps.tabValue);
    });
  });

  describe("When is rendered an interactions are made", () => {
    test("Then it should call setTabValue after firing the click event on a non selected tab", () => {
      const tabTwo = screen.getAllByRole("tab")[1];

      fireEvent.click(tabTwo);

      expect(navbarProps.setTabValue).toHaveBeenCalled();
    });
  });
});
