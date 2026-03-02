import React from "react";
import { Button, alpha, useTheme } from "@mui/material";

const ActionButton = ({
    icon: Icon,
    label,
    onClick,
    variant = "contained",
    color = "primary",
}) => {
    const theme = useTheme();
    const mainColor = theme.palette[color]?.main || theme.palette.primary.main;
    const darkColor = theme.palette[color]?.dark || theme.palette.primary.dark;

    return (
        <Button
            variant={variant}
            startIcon={Icon && <Icon sx={{ fontSize: 20 }} />}
            onClick={onClick}
            sx={{
                py: 1.5,
                px: 3,
                borderRadius: "14px",
                textTransform: "none",
                fontWeight: 800,
                fontSize: "0.95rem",
                letterSpacing: "0.3px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                ...(variant === "contained" ? {
                    background: `linear-gradient(135deg, ${mainColor} 0%, ${darkColor} 100%)`,
                    boxShadow: `0 8px 16px ${alpha(mainColor, 0.25)}`,
                    border: "none",
                    "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: `0 12px 20px ${alpha(mainColor, 0.35)}`,
                        background: `linear-gradient(135deg, ${mainColor} 0%, ${darkColor} 100%)`,
                    }
                } : {
                    borderColor: alpha(mainColor, 0.3),
                    color: mainColor,
                    borderWidth: "2px",
                    "&:hover": {
                        borderWidth: "2px",
                        borderColor: mainColor,
                        bgcolor: alpha(mainColor, 0.04),
                        transform: "translateY(-2px)",
                    }
                }),
                width: { xs: "100%", sm: "auto" },
            }}
        >
            {label}
        </Button>
    );
};

export default ActionButton;
