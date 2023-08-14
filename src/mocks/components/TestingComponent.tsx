import { useContext } from "react";

import ResourcesManagementContext from "resources-management/core/store/context/ResourcesManagementContext";

const TestingComponent = () => {
  const { interventionData } = useContext(ResourcesManagementContext);
  return (
    <div>
      <h1 data-testid={"request-code"}>{interventionData.requestCode}</h1>
      <p data-testid={"operating-room"}>{interventionData.operatingRoom}</p>
    </div>
  );
};

export default TestingComponent;
