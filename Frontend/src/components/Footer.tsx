import React from 'react';
import {
  Box,
  Container,
  Text,
  useColorModeValue,
  HStack,
  Link,
  VStack,
  Divider,
  SimpleGrid
} from '@chakra-ui/react';
import { Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      borderTop="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      mt="auto"
    >
      <Container maxW="container.xl" py={12}>
        <VStack spacing={8}>
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8} w="full">
            {/* Brand */}
            <VStack align="start" spacing={4}>
              <Text fontSize="lg" fontWeight="700" color="gray.800">
                Notest
              </Text>
              <Text fontSize="sm" color="gray.600" lineHeight="1.6">
                Transform your notes into knowledge with AI-powered learning tools.
              </Text>
            </VStack>

            {/* Product */}
            <VStack align="start" spacing={3}>
              <Text fontSize="sm" fontWeight="600" color="gray.800">
                Product
              </Text>
              <VStack align="start" spacing={2}>
                <Link href="#" fontSize="sm" color="gray.600" _hover={{ color: 'gray.800' }}>
                  Features
                </Link>
                <Link href="#" fontSize="sm" color="gray.600" _hover={{ color: 'gray.800' }}>
                  Pricing
                </Link>
                <Link href="#" fontSize="sm" color="gray.600" _hover={{ color: 'gray.800' }}>
                  API
                </Link>
              </VStack>
            </VStack>

            {/* Company */}
            <VStack align="start" spacing={3}>
              <Text fontSize="sm" fontWeight="600" color="gray.800">
                Company
              </Text>
              <VStack align="start" spacing={2}>
                <Link href="#" fontSize="sm" color="gray.600" _hover={{ color: 'gray.800' }}>
                  About
                </Link>
                <Link href="#" fontSize="sm" color="gray.600" _hover={{ color: 'gray.800' }}>
                  Blog
                </Link>
                <Link href="#" fontSize="sm" color="gray.600" _hover={{ color: 'gray.800' }}>
                  Careers
                </Link>
              </VStack>
            </VStack>

            {/* Support */}
            <VStack align="start" spacing={3}>
              <Text fontSize="sm" fontWeight="600" color="gray.800">
                Support
              </Text>
              <VStack align="start" spacing={2}>
                <Link href="#" fontSize="sm" color="gray.600" _hover={{ color: 'gray.800' }}>
                  Help Center
                </Link>
                <Link href="#" fontSize="sm" color="gray.600" _hover={{ color: 'gray.800' }}>
                  Contact
                </Link>
                <Link href="#" fontSize="sm" color="gray.600" _hover={{ color: 'gray.800' }}>
                  Privacy
                </Link>
              </VStack>
            </VStack>
          </SimpleGrid>

          <Divider />

          <HStack
            justify="space-between"
            w="full"
            flexDirection={{ base: 'column', md: 'row' }}
            spacing={4}
          >
            <Text fontSize="sm" color="gray.500">
              © {currentYear} Notest. All rights reserved.
            </Text>
            <HStack spacing={1} fontSize="sm" color="gray.500">
              <Text>Made with</Text>
              <Heart size={14} fill="currentColor" />
              <Text>by AI Team 138</Text>
            </HStack>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default Footer;