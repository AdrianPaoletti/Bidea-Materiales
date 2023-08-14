import { hasPermission, permissionTasks } from "./has-permissions.utils";

describe("Given a hasPermissions function", () => {
  describe("When is called", () => {
    test("Then it should return 'false' when the user has not permissions", () => {
      const mockTasks: permissionTasks[] = [
        "rPrecargaRecursos",
        "wPrecargaRecursos",
        "rCargaRecursos",
        "wCargaRecursos",
      ];
      const mockuserPermissions: permissionTasks[] = [];

      const result = hasPermission(mockTasks, mockuserPermissions);

      expect(result).toBeFalsy();
    });
  });
});
