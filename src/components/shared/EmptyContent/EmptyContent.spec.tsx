import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";

import { render } from "@testing-library/react";

import ResourcesManagementContext from "resources-management/core/store/context/ResourcesManagementContext";
import store from "resources-management/core/store/redux";
import { resourceManagementContextMock } from "resources-management/mocks/context/resource-management-context.mock";
import i18n from "resources-management/statics/locales/i18n";
import EmptyContent, { EmptyContentProps } from "./EmptyContent";

const emptyContentProps: EmptyContentProps = {
  text: "Empty content test",
  icon: <></>,
  height: "40rem",
};

describe("Given a EmptyContent component", () => {
  beforeEach(() => {
    render(
      <ResourcesManagementContext.Provider
        value={resourceManagementContextMock}
      >
        <Provider store={store}>
          <EmptyContent {...emptyContentProps} />
        </Provider>
      </ResourcesManagementContext.Provider>
    );

    act(() => {
      i18n.init();
    });
  });

  describe("When is rendered", () => {
    test("Then it should appear 'Empty content test' in the view", () => {
      expect(emptyContentProps.text).toBeInTheDocument;
    });
  });
});
