import React from "react";
import { styled, alpha, useTheme } from "@mui/material/styles";
import {
  Card,
  CardContent,
  // CardMedia,
  Typography,
  Chip,
  Box,
  // Button,
  // Link,
} from "@mui/material";
// import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { DetailItem } from "../types";
import { getTagColor } from "../../resources/getTagColor";

const DetailCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius * 2,
  overflow: "hidden", // Keep this to ensure children with border-radius clip correctly
  transition: theme.transitions.create(["box-shadow", "transform"], {
    duration: theme.transitions.duration.shorter,
  }),
  "&:hover": {
    boxShadow: theme.shadows[4],
    transform: "translateY(-2px)",
  },
}));

// No changes needed here, but its styling is why we change the prop in the component
// const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
//   height: 300,
//   backgroundSize: "contain",
//   backgroundPosition: "center",
//   backgroundRepeat: "no-repeat",
//   backgroundColor: alpha(theme.palette.primary.main, 0.05),
//   // Add margin for spacing
//   marginTop: theme.spacing(2),
//   marginBottom: theme.spacing(1),
// }));

const TagContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const StyledChip = styled(Chip)<{ tagcolor: string }>(({ tagcolor }) => ({
  "&.MuiChip-root": {
    backgroundColor: alpha(tagcolor, 0.1),
    color: tagcolor,
    borderColor: alpha(tagcolor, 0.3),
    "&:hover": {
      backgroundColor: alpha(tagcolor, 0.2),
    },
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flex: "1 1 auto",
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(3),
  // CHANGED: Added overflowY to make this specific area scrollable
  overflowY: "auto",
  "& .MuiTypography-h5": {
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightBold,
  },
  "& .MuiTypography-subtitle1": {
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
  "& .MuiTypography-body1": {
    color: theme.palette.text.primary,
    lineHeight: 1.6,
  },
}));

const EmptyStateContainer = styled(Box)(({ theme }) => ({
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(3),
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  borderRadius: theme.shape.borderRadius * 2,
  color: theme.palette.text.primary,
}));

// const LinkButton = styled(Link)(({ theme }) => ({
//   marginTop: "auto", // Pushes the button to the bottom
//   paddingTop: theme.spacing(2), // Add some space above the button
//   alignSelf: "flex-start",
//   display: "inline-flex",
//   alignItems: "center",
//   textDecoration: "none",
//   "&:hover": {
//     textDecoration: "none",
//   },
// }));

interface DetailPaneProps {
  selectedItem: DetailItem | null;
}

const DetailPane: React.FC<DetailPaneProps> = ({ selectedItem }) => {
  const theme = useTheme();

  if (!selectedItem) {
    return (
      <DetailCard>
        <EmptyStateContainer>
          <Typography variant="h6" color="textSecondary">
            Select an item to view details
          </Typography>
        </EmptyStateContainer>
      </DetailCard>
    );
  }

  return (
    <DetailCard>
      <StyledCardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          {selectedItem.label}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          {selectedItem.type.charAt(0).toUpperCase() +
            selectedItem.type.slice(1)}
          {selectedItem.year && ` • ${selectedItem.year}`}
        </Typography>
        {selectedItem.description && (
          <Typography variant="body1" paragraph>
            {selectedItem.description}
          </Typography>
        )}
        {selectedItem.tags && selectedItem.tags.length > 0 && (
          <TagContainer>
            {selectedItem.tags.map((tag) => (
              <StyledChip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                tagcolor={getTagColor(tag, theme)}
              />
            ))}
          </TagContainer>
        )}
        {/* {selectedItem.image && (
          // CHANGED: Use the `image` prop instead of `src` for background images
          <StyledCardMedia
            image={selectedItem.image}
            title={selectedItem.label}
          />
        )}
        {selectedItem.externalLink && (
          <LinkButton
            href={selectedItem.externalLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outlined"
              color="primary"
              startIcon={<OpenInNewIcon />}
            >
              Learn More
            </Button>
          </LinkButton>
        )} */}
      </StyledCardContent>
    </DetailCard>
  );
};

export default DetailPane;
