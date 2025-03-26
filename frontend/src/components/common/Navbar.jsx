import { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, IconButton, Avatar, 
  Menu, MenuItem, Box, useMediaQuery, useTheme, Drawer, List, 
  ListItem, ListItemIcon, ListItemText, Divider 
} from '@mui/material';
import { 
  Menu as MenuIcon, Dashboard, People, School,
  CalendarMonth, Book, PersonAdd, Login, Logout, AccountCircle
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  
  // Este estado tendría que venir de un contexto o servicio de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    handleClose();
    navigate('/login');
  };
  
  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Buscar Mentor', icon: <People />, path: '/search' },
    { text: 'Mis Mentorías', icon: <School />, path: '/mentorships' },
    { text: 'Sesiones', icon: <CalendarMonth />, path: '/sessions' },
    { text: 'Recursos', icon: <Book />, path: '/resources' },
  ];
  
  return (
    <>
      <AppBar position="fixed" color="primary">
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1 }}>
            UTutor SJR
          </Typography>
          
          {!isMobile && isAuthenticated && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {menuItems.map((item) => (
                <Button 
                  key={item.text}
                  color="inherit" 
                  component={Link} 
                  to={item.path}
                  sx={{ mx: 1 }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
          
          {!isAuthenticated ? (
            <Box>
              <Button 
                color="inherit" 
                component={Link} 
                to="/register"
                startIcon={<PersonAdd />}
                sx={{ ml: 1 }}
              >
                Registro
              </Button>
              <Button 
                color="secondary" 
                variant="contained"
                component={Link} 
                to="/login"
                startIcon={<Login />}
                sx={{ ml: 1 }}
              >
                Iniciar Sesión
              </Button>
            </Box>
          ) : (
            <Box>
              <IconButton
                onClick={handleMenu}
                size="large"
                edge="end"
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  AM
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <MenuItem component={Link} to="/profile">Mi Perfil</MenuItem>
                <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: 240 },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" component="div">
            UTutor SJR
          </Typography>
        </Box>
        <Divider />
        <List>
          {isAuthenticated && menuItems.map((item) => (
            <ListItem 
              button 
              key={item.text} 
              component={Link} 
              to={item.path}
              onClick={handleDrawerToggle}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
          
          {!isAuthenticated ? (
            <>
              <ListItem 
                button 
                component={Link} 
                to="/register"
                onClick={handleDrawerToggle}
              >
                <ListItemIcon><PersonAdd /></ListItemIcon>
                <ListItemText primary="Registro" />
              </ListItem>
              <ListItem 
                button 
                component={Link} 
                to="/login"
                onClick={handleDrawerToggle}
              >
                <ListItemIcon><Login /></ListItemIcon>
                <ListItemText primary="Iniciar Sesión" />
              </ListItem>
            </>
          ) : (
            <>
              <ListItem 
                button 
                component={Link} 
                to="/profile"
                onClick={handleDrawerToggle}
              >
                <ListItemIcon><AccountCircle /></ListItemIcon>
                <ListItemText primary="Mi Perfil" />
              </ListItem>
              <ListItem 
                button 
                onClick={() => {
                  handleLogout();
                  handleDrawerToggle();
                }}
              >
                <ListItemIcon><Logout /></ListItemIcon>
                <ListItemText primary="Cerrar Sesión" />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
      
      <Toolbar /> {/* Espaciador para contenido debajo del AppBar */}
    </>
  );
};

export default Navbar;