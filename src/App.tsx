import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Container from '@mui/material/Container'
import Upload from './components/Upload';
import View from './components/View';
import Package from './components/Package';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { IPackage } from './interfaces/Interfaces';

function App() {
  const [tabValue, setTabValue] = useState('upload');
  const [packages, setPackages] = useState<IPackage["packageArray"] | undefined>([]);
  const [packageName, setPackageName] = useState<string>("");

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
            <Route path="/" element={<Upload tabValue={tabValue} setTabValue={setTabValue}
            setPackages={setPackages} packages={packages} />} />
            <Route path="/upload" element={<Upload tabValue={tabValue} setTabValue={setTabValue}
            setPackages={setPackages} packages={packages} />} />
            <Route path="/view" element={<View packages={packages} setPackageName={setPackageName} />} />
            <Route path="/package" element={<Package packages={packages} packageName={packageName}
            setPackageName={setPackageName} />} />
          </Routes>
        </Container>
      </Router>
    </div>
  );
}

export default App;
