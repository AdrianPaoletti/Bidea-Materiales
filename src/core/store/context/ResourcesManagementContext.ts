import { createContext } from "react";

import { InterventionDTO } from "@ikusi/resources-management-api-typescript-fetch";

import { permissionTasks } from "../../../utils/permissions/has-permissions.utils";
import { ClientSession } from "../../models/client-session.model";

export interface ResourcesManagementCreateContext {
  clientSession: ClientSession;
  setClientSession: React.Dispatch<React.SetStateAction<ClientSession>>;
  interventionData: InterventionDTO;
  setInterventionData: React.Dispatch<React.SetStateAction<InterventionDTO>>;
  prevUrl: string;
  setPrevUrl: React.Dispatch<React.SetStateAction<string>>;
  userPermissions: permissionTasks[];
  setUserPermissions: React.Dispatch<React.SetStateAction<permissionTasks[]>>;
}

const ResourcesManagementContext =
  createContext<ResourcesManagementCreateContext>(
    {} as ResourcesManagementCreateContext
  );
ResourcesManagementContext.displayName = "Resources Management Context";

export default ResourcesManagementContext;
