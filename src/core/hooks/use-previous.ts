import { useEffect, useRef } from "react";

import { SelectedPreloadedResource } from "resources-management/components/PreloadedResources/preloaded-resources.model";
import { ActiveFilters } from "../models/active-filters.model";

const usePrevious = (
  value: ActiveFilters | SelectedPreloadedResource | number | null
) => {
  const ref = useRef<ActiveFilters | SelectedPreloadedResource | number | null>(
    null
  );
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

export default usePrevious;
