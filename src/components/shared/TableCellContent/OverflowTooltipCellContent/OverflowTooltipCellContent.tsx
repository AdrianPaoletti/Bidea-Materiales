import { useCallback, useEffect, useRef, useState } from "react";

import { Tooltip, Typography } from "@mui/material";

interface TypograhpyOverflowProps {
  content: string | number | null | undefined | JSX.Element;
  id: string;
}

const OverflowTooltipCellContent = ({
  id,
  content,
}: TypograhpyOverflowProps) => {
  const [isOverflowed, setIsOverflow] = useState<boolean>(false);
  const paragraphElementRef = useRef<HTMLParagraphElement>(null);

  const compareSize = useCallback(() => {
    if (!isOverflowed && paragraphElementRef.current) {
      const { scrollWidth, clientWidth } = paragraphElementRef.current;
      setIsOverflow(scrollWidth > clientWidth);
    }
  }, [isOverflowed]);

  useEffect(() => {
    compareSize();
    window.addEventListener("resize", compareSize);
    return () => window.removeEventListener("resize", compareSize);
  }, [compareSize]);

  return (
    <Tooltip
      title={content}
      disableHoverListener={!isOverflowed}
      placement="bottom-end"
      PopperProps={{
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [-5, -11],
            },
          },
        ],
      }}
    >
      <Typography
        ref={paragraphElementRef}
        noWrap
        component="p"
        color={"inherit"}
        fontWeight={["name", "additionalContent"].includes(id) ? 700 : ""}
        fontSize={id === "description" ? "1.3rem" : "1.4rem"}
      >
        {content}
      </Typography>
    </Tooltip>
  );
};

export default OverflowTooltipCellContent;
