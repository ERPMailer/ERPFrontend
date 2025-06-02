"use client";
import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Container,
  useMediaQuery,
  useTheme,
  Pagination,
  IconButton,
  Tooltip,
  CardActions,
} from "@mui/material";
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

const mockTemplates = [
  {
    id: "1",
    name: "Landing Page Template",
    createdBy: "John Doe",
    createdAt: "2024-01-15",
    status: "published",
  },
  {
    id: "2",
    name: "Dashboard Layout",
    createdBy: "Jane Smith",
    createdAt: "2024-01-14",
    status: "active",
  },
  {
    id: "3",
    name: "E-commerce Product Page",
    createdBy: "Mike Johnson",
    createdAt: "2024-01-13",
    status: "draft",
  },
  {
    id: "4",
    name: "Blog Post Template",
    createdBy: "Sarah Wilson",
    createdAt: "2024-01-12",
    status: "archived",
  },
  {
    id: "5",
    name: "Contact Form Layout",
    createdBy: "David Brown",
    createdAt: "2024-01-11",
    status: "published",
  },
  {
    id: "6",
    name: "Portfolio Showcase",
    createdBy: "Emily Davis",
    createdAt: "2024-01-10",
    status: "active",
  },
  {
    id: "7",
    name: "Newsletter Template",
    createdBy: "Robert Miller",
    createdAt: "2024-01-09",
    status: "draft",
  },
  {
    id: "8",
    name: "Event Registration",
    createdBy: "Lisa Anderson",
    createdAt: "2024-01-08",
    status: "published",
  },
  {
    id: "9",
    name: "Product Catalog",
    createdBy: "James Wilson",
    createdAt: "2024-01-07",
    status: "active",
  },
  {
    id: "10",
    name: "User Profile Page",
    createdBy: "Maria Garcia",
    createdAt: "2024-01-06",
    status: "archived",
  },
  {
    id: "11",
    name: "FAQ Section",
    createdBy: "Thomas Lee",
    createdAt: "2024-01-05",
    status: "published",
  },
  {
    id: "12",
    name: "Pricing Table",
    createdBy: "Jennifer Taylor",
    createdAt: "2024-01-04",
    status: "draft",
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "published":
      return { backgroundColor: "#e8f5e8", color: "#2e7d32" };
    case "active":
      return { backgroundColor: "#e3f2fd", color: "#1976d2" };
    case "draft":
      return { backgroundColor: "#fff3e0", color: "#f57c00" };
    case "archived":
      return { backgroundColor: "#f5f5f5", color: "#616161" };
    default:
      return { backgroundColor: "#f5f5f5", color: "#616161" };
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getInitials = (name) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getAvatarColor = (name) => {
  const colors = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const MobileTemplateCard = ({ template, onEdit }) => (
  <Card sx={{ mb: 2, boxShadow: 2 }}>
    <CardContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          component="h3"
          sx={{ fontWeight: 600, flex: 1 }}
        >
          {template.name}
        </Typography>
        <Chip
          label={template.status}
          size="small"
          sx={{
            ...getStatusColor(template.status),
            fontWeight: 500,
            textTransform: "capitalize",
            ml: 1,
          }}
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <PersonIcon sx={{ fontSize: 16, color: "text.secondary", mr: 1 }} />
        <Typography variant="body2" color="text.secondary">
          {template.createdBy}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <CalendarIcon sx={{ fontSize: 16, color: "text.secondary", mr: 1 }} />
        <Typography variant="body2" color="text.secondary">
          {formatDate(template.createdAt)}
        </Typography>
      </Box>
    </CardContent>
    <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
      <Tooltip title="Edit Template">
        <IconButton
          color="primary"
          onClick={() => onEdit(template)}
          sx={{
            "&:hover": {
              backgroundColor: "primary.main",
              color: "white",
            },
          }}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
    </CardActions>
  </Card>
);

const DesktopTemplateTable = ({ templates, onEdit }) => (
  <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
    <Table>
      <TableHead>
        <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
          <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
            Template Name
          </TableCell>
          <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
            Created By
          </TableCell>
          <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
            Created At
          </TableCell>
          <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
            Status
          </TableCell>
          <TableCell
            sx={{ fontWeight: 600, fontSize: "0.875rem", textAlign: "center" }}
          >
            Actions
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {templates.map((template) => (
          <TableRow
            key={template.id}
            sx={{
              "&:hover": { backgroundColor: "#f9f9f9" },
              "&:last-child td, &:last-child th": { border: 0 },
            }}
          >
            <TableCell>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {template.name}
              </Typography>
            </TableCell>
            <TableCell>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: "0.75rem",
                    backgroundColor: getAvatarColor(template.createdBy),
                    mr: 2,
                  }}
                >
                  {getInitials(template.createdBy)}
                </Avatar>
                <Typography variant="body2">{template.createdBy}</Typography>
              </Box>
            </TableCell>
            <TableCell>
              <Typography variant="body2" color="text.secondary">
                {formatDate(template.createdAt)}
              </Typography>
            </TableCell>
            <TableCell>
              <Chip
                label={template.status}
                size="small"
                sx={{
                  ...getStatusColor(template.status),
                  fontWeight: 500,
                  textTransform: "capitalize",
                }}
              />
            </TableCell>
            <TableCell sx={{ textAlign: "center" }}>
              <Tooltip title="Edit Template">
                <IconButton
                  color="primary"
                  onClick={() => onEdit(template)}
                  sx={{
                    "&:hover": {
                      backgroundColor: "primary.main",
                      color: "white",
                    },
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default function ListTemplate() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate pagination
  const totalPages = Math.ceil(mockTemplates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTemplates = mockTemplates.slice(startIndex, endIndex);

  // Handle pagination change
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  // Handle edit action
  const handleEdit = (template) => {
    console.log("Editing template:", template);
    // Here you would typically navigate to an edit page or open a modal
    alert(`Editing template: ${template.name}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 1 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          Templates
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and organize your template collection
        </Typography>
      </Box>

      {isMobile ? (
        <Box>
          {currentTemplates.map((template) => (
            <MobileTemplateCard
              key={template.id}
              template={template}
              onEdit={handleEdit}
            />
          ))}
        </Box>
      ) : (
        <DesktopTemplateTable
          templates={currentTemplates}
          onEdit={handleEdit}
        />
      )}

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          size={isMobile ? "small" : "medium"}
          showFirstButton
          showLastButton
          sx={{
            "& .MuiPaginationItem-root": {
              fontSize: isMobile ? "0.75rem" : "0.875rem",
            },
          }}
        />
      </Box>

      {/* Pagination Info */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {startIndex + 1}-{Math.min(endIndex, mockTemplates.length)} of{" "}
          {mockTemplates.length} templates
        </Typography>
      </Box>
    </Container>
  );
}
