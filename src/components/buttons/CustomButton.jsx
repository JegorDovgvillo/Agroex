import React from "react";
import Button from "@mui/material/Button";

const commonButtonStyles = {
  display: "flex",
  borderRadius: "2px",
  textTransform: "none",
};

const getStyles = (size, width) => {
  if (size === "L") {
    return {
      fontSize: "1.125rem",
      lineHeight: "1.75rem",
      fontWeight: "500",
      letterSpasing: "0.4px",
      padding: "10px, 20px",
      width: width || "170px",
      height: "48px",
      rowGap: "12px",
    };
  }

  if (size === "M") {
    return {
      fontSize: "1rem",
      lineHeight: "1.5rem",
      fontWeight: "500",
      letterSpasing: "0.3px",
      padding: "8px, 16px",
      width: width || "148px",
      height: "40px",
      rowGap: "12px",
    };
  }

  if (size === "S") {
    return {
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      fontWeight: "500",
      letterSpasing: "0.3px",
      padding: "6px, 12px",
      width: width || "121px",
      height: "32px",
      rowGap: "10px",
    };
  }
};

export const CustomButton = ({
  text = "",
  size = "L",
  type = "primary",
  disabled = false,
  icon = null,
  width = null,
}) => {
  const buttonStyles = getStyles(size, width);
  const style = { ...commonButtonStyles, ...buttonStyles };

  return (
    <Button
      startIcon={icon || undefined}
      variant={
        (type === "primary" && "contained") ||
        (type === "secondary" && "outlined") ||
        (type === "clear" && "text")
      }
      disabled={disabled}
      style={style}
    >
      {text}
    </Button>
  );
};
