import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Container from '@mui/material/Container'
import Upload from './components/Upload';
import View from './components/View';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  const [tabValue, setTabValue] = useState('upload')

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  return (
    <div>
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar sx={{justifyContent: "center"}}>
              <Tabs
                value={tabValue}
                onChange={handleChange}
                textColor="inherit"
                indicatorColor="primary"
                aria-label="tab menu">
                <Tab value="upload" to="/upload" component={Link} label="Upload" />
                <Tab value="view" to="/view" component={Link} label="View" />
              </Tabs>
            </Toolbar>
          </AppBar>
        </Box>
        <Container>
          <Routes>
            <Route path="/" element={<Upload />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/view" element={<View />} />
          </Routes>
        </Container>
      </Router>
    </div>
  );
}

export default App;
