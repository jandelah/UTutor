import { Box } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh' 
    }}>
      <Navbar />
      <Box component="main" sx={{ 
        py: 4, 
        px: 2, 
        flexGrow: 1,
        backgroundColor: 'background.default' 
      }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;