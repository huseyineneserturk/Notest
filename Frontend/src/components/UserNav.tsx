import React from 'react';
import { Box, Container, Flex, Menu, MenuButton, MenuItem, MenuList, Avatar, useColorModeValue } from '@chakra-ui/react';
import { ChevronDown } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
const UserNav = () => {
  return <Box py={2} px={6} bg={useColorModeValue('white', 'gray.800')} borderBottom="1px" borderColor={useColorModeValue('gray.100', 'gray.700')} width="100%">
      <Container maxW="container.lg">
        <Flex justify="flex-end">
          <Menu>
            <MenuButton as={Flex} align="center" cursor="pointer" _hover={{
            color: 'gray.600'
          }}>
              <Avatar size="sm" name="User" bg="gray.300" mr={2} />
              <ChevronDown size={16} />
            </MenuButton>
            <MenuList>
              <MenuItem as={RouterLink} to="/dashboard">
                Dashboard
              </MenuItem>
              <MenuItem as={RouterLink} to="/performance">
                Performance History
              </MenuItem>
              <MenuItem as={RouterLink} to="/settings">
                Settings
              </MenuItem>
              <MenuItem as={RouterLink} to="/">
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Container>
    </Box>;
};
export default UserNav;