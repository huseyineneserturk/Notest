import React from 'react';
import { 
  Box, 
  Flex, 
  Image, 
  useColorModeValue, 
  Menu, 
  MenuButton, 
  MenuItem, 
  MenuList, 
  Avatar,
  Container,
  HStack,
  Text,
  useToast
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const toast = useToast();
  
  // Dashboard sayfalarında kullanıcı menüsünü göster
  const showUserMenu = isAuthenticated && ['/dashboard', '/performance', '/notebook/'].some(path => 
    location.pathname.startsWith(path)
  );

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to logout. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box 
      as="header" 
      py={3} 
      px={8} 
      bg={useColorModeValue('white', 'gray.800')} 
      borderBottom="1px" 
      borderColor={useColorModeValue('gray.100', 'gray.700')} 
      width="100%"
      boxShadow="sm"
      height="100px"
      display="flex"
      alignItems="center"
    >
      <Container maxW="container.xl" height="100%">
        <Flex justify="center" align="center" height="100%" position="relative">
          {/* Logo - Centered */}
          <RouterLink to={isAuthenticated ? "/dashboard" : "/"}>
            <Image 
              src="/Resources/Notest_Logo.png" 
              alt="Notest Logo" 
              height="150px" 
              width="auto"
              filter="grayscale(1)"
              _hover={{ 
                filter: "grayscale(0.8)",
                transform: "scale(1.05)"
              }}
              transition="all 0.2s"
              objectFit="contain"
            />
          </RouterLink>

          {/* User Navigation - Positioned absolutely to right */}
          {showUserMenu && (
            <Flex 
              position="absolute" 
              right="0" 
              align="center" 
              justify="center"
              height="100%"
            >
              <Menu>
                <MenuButton 
                  as={Avatar} 
                  size="sm" 
                  name={user?.displayName}
                  bg="gray.400" 
                  color="white"
                  cursor="pointer"
                  _hover={{ 
                    bg: 'gray.500',
                    transform: 'scale(1.05)'
                  }}
                  transition="all 0.2s"
                />
                <MenuList 
                  borderColor={useColorModeValue('gray.200', 'gray.600')}
                  boxShadow="lg"
                >
                  <MenuItem 
                    as={RouterLink} 
                    to="/dashboard"
                    _hover={{ bg: useColorModeValue('gray.50', 'gray.600') }}
                  >
                    Dashboard
                  </MenuItem>
                  <MenuItem 
                    as={RouterLink} 
                    to="/performance"
                    _hover={{ bg: useColorModeValue('gray.50', 'gray.600') }}
                  >
                    Performance History
                  </MenuItem>
                  <MenuItem 
                    as={RouterLink} 
                    to="/settings"
                    _hover={{ bg: useColorModeValue('gray.50', 'gray.600') }}
                  >
                    Settings
                  </MenuItem>
                  <MenuItem 
                    onClick={handleLogout}
                    _hover={{ bg: useColorModeValue('red.50', 'red.900') }}
                    color={useColorModeValue('red.600', 'red.300')}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          )}
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;