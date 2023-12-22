import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ActiveHoursPage from "../ActiveHour";
import { useRouter } from "next/router";


export const MainListItems = () => {
  const router = useRouter();

  const handleActiveHourNavigation = () => {
    router.push('/ActiveHour');
  };
  const handleDifficultQuestNavigation = () => {
    router.push('/DifficultQuestions');
  };
  const handlePopTagsNavigation = () => {
    router.push('/PopTrendChart');
  };
  const handlePostNavigation = () => {
    router.push('/posts');
  };
  const handleMostPopTrendNavigation = () => {
    router.push('/MostPop');
  };
  const handleTrendNavigation = () => {
    router.push('/TrendChart');
  };
  const handleSimilarNavigation = () => {
    router.push('/TopSimilarQuestions');
  };
  const handleParticipationNavigation = () => {
    router.push('/UserParticipation');
  };
  return (
    <React.Fragment>
      <ListItemButton onClick={handleDifficultQuestNavigation}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Difficult Questions" />
      </ListItemButton>
      <ListItemButton onClick={handleActiveHourNavigation}>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Active Hours" />
      </ListItemButton>
      <ListItemButton onClick={handleMostPopTrendNavigation}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Popular Questions" />
      </ListItemButton>
      <ListItemButton onClick={handlePopTagsNavigation}>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Popular Tags" />
      </ListItemButton >
      <ListItemButton onClick={handlePostNavigation}>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Posts" />
      </ListItemButton>
      <ListItemButton onClick={handleTrendNavigation}>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Trend analysis" />
      </ListItemButton>
      <ListItemButton onClick={handleSimilarNavigation}>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Similar Sugesstions" />
      </ListItemButton>
      <ListItemButton onClick={handleParticipationNavigation}>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="User Participation" />
      </ListItemButton>
    </React.Fragment>
  );
};

export const SecondaryListItems = () => (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Saved reports
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItemButton>
  </React.Fragment>
);
