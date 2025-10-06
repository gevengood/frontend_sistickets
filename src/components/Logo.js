// src/components/Logo.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const Logo = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {/* SVG del taco */}
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12H2Z" fill="#D2691E"/>
        <path d="M5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12H5Z" fill="#F4A460"/>
      </svg>
      <Typography
        variant="h6"
        component="div"
        sx={{ flexGrow: 1, fontWeight: 'bold' }}
      >
        Tacos de Birria Solutions
      </Typography>
    </Box>
  );
};

export default Logo;