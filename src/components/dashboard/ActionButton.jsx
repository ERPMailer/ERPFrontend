import React from "react";
import { Button } from "@mui/material";

const ActionButton = ({
    icon: Icon,
    label,
    onClick,
    variant = "contained",
    size,
}) => {
    return (
        <Button
            variant={variant}
            startIcon={<Icon />}
            onClick={onClick}
            fullWidth
            sx={{
                py: { xs: 1, md: 1 },
                px: { xs: 1, md: 2 },
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: { xs: "0.850rem", md: "0.9rem" },
                boxShadow:
                    variant === "contained"
                        ? "0 2px 8px rgba(99, 102, 241, 0.2)"
                        : "none",
                "@media (min-width: 600px)": {
                    width: "auto",
                    flex: { sm: "1 1 auto", md: "0 1 auto" },
                },
                "&:hover": {
                    boxShadow:
                        variant === "contained"
                            ? "0 4px 12px rgba(99, 102, 241, 0.3)"
                            : "none",
                },
            }}
        >
            {label}
        </Button>
    );
};

export default ActionButton;
