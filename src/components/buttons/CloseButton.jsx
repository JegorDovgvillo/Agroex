import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";

const commonButtonStyles = {
  boxSizing: "border-box",
  minWidth: "32px",
  display: "flex",
  borderRadius: "2px",
  textTransform: "none",
};

const getCloseStyles = (size) => {
  if (size === "L") {
    return {
      width: "48px",
      height: "48px",
      padding: "12px",
    };
  }

  if (size === "M") {
    return {
      width: "40px",
      height: "40px",
      padding: "10px",
    };
  }

  if (size === "S") {
    return {
      width: "32px",
      height: "32px",
      padding: "8px",
    };
  }
};

export const CloseButton = ({
  size = "L",
  type = "primary",
  disabled = false,
}) => {
  const buttonStyles = getCloseStyles(size);
  const style = { ...commonButtonStyles, ...buttonStyles };

  return (
    <Button
      variant={
        (type === "primary" && "contained") ||
        (type === "secondary" && "outlined") ||
        (type === "clear" && "text")
      }
      disabled={disabled}
      style={style}
    >
      <CloseIcon
        style={
          (size === "M" && { width: "20px", height: "20px" }) ||
          (size === "S" && { width: "16px", height: "16px" })
        }
      />
    </Button>
  );
};
