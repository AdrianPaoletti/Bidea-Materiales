import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { InterventionDTO } from "@ikusi/resources-management-api-typescript-fetch";

import { permissionTasks } from "../../../utils/permissions/has-permissions.utils";
import { ClientSession } from "../../models/client-session.model";
import ResourcesManagementContext from "./ResourcesManagementContext";

interface ResourcesManagementContextProviderProps {
  children: JSX.Element;
}

const ResourcesManagementContextProvider = ({
  children,
}: ResourcesManagementContextProviderProps) => {
  const router = useRouter();
  const [interventionData, setInterventionData] = useState<InterventionDTO>({
    requestCode: 0,
    hub: "-",
    facultativeId: "-",
    procedureId: "-",
    serviceId: "-",
    dateFrom: "",
    dateTo: "",
    duration: 0,
    operatingRoom: "-",
    surgicalHub: "-",
    proposal: false,
    patientName: "",
    patientSurname: "",
    patientExternalCode: "",
  });
  const [clientSession, setClientSession] = useState<ClientSession>({
    UserName: "",
    apitoken: "",
    centroActual: "",
    centros: "",
    exp: 0,
    permisos: "",
    secciones: "",
    token: "",
  });

  const [prevUrl, setPrevUrl] = useState<string>("");

  const [userPermissions, setUserPermissions] = useState<permissionTasks[]>([]);

  useEffect(() => {
    const client = JSON.parse(localStorage.getItem("client_session") as string);
    setClientSession(client);
  }, []);

  useEffect(() => {
    const prevUrl = router.query.prevUrl as string;
    setPrevUrl(prevUrl);
  }, [router.query.prevUrl]);

  return (
    <ResourcesManagementContext.Provider
      value={{
        clientSession,
        setClientSession,
        interventionData,
        setInterventionData,
        prevUrl,
        setPrevUrl,
        userPermissions,
        setUserPermissions,
      }}
    >
      {children}
    </ResourcesManagementContext.Provider>
  );
};

export default ResourcesManagementContextProvider;
