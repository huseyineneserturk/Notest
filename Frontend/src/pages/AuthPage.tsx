import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Flex, 
  FormControl, 
  FormLabel, 
  Heading, 
  Input, 
  Text, 
  Link, 
  useColorModeValue, 
  Divider,
  VStack,
  Icon,
  Alert,
  AlertIcon,
  InputGroup,
  InputRightElement,
  IconButton
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Header from '../components/Header';

const AuthPage = ({ isLogin = false }: { isLogin?: boolean }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <Box 
      width="100%" 
      minHeight="100vh" 
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Header />
      <Container maxW="md" py={16}>
        <Box 
          bg={useColorModeValue('white', 'gray.700')} 
          p={10} 
          borderRadius="xl" 
          boxShadow="lg" 
          borderWidth="1px" 
          borderColor={useColorModeValue('gray.200', 'gray.600')}
        >
          <VStack spacing={6}>
            <VStack spacing={3} textAlign="center">
              <Heading 
                as="h1" 
                size="lg" 
                color="gray.800"
                fontWeight="700"
              >
                {isLogin ? 'Welcome Back to Notest' : 'Create Your Notest Account'}
              </Heading>
              <Text color="gray.600" fontSize="md">
                {isLogin 
                  ? 'Continue your learning journey' 
                  : 'Start transforming your notes into knowledge'
                }
              </Text>
            </VStack>

            <Box width="100%">
              <form onSubmit={handleSubmit}>
                <VStack spacing={5}>
                  <FormControl id="email" isRequired>
                    <FormLabel color="gray.700" fontWeight="500">
                      Email Address
                    </FormLabel>
                    <Input 
                      type="email" 
                      bg={useColorModeValue('gray.50', 'gray.600')} 
                      borderColor={useColorModeValue('gray.300', 'gray.500')}
                      _focus={{
                        borderColor: 'gray.500',
                        boxShadow: '0 0 0 1px #4A5568',
                        bg: 'white'
                      }}
                      _hover={{
                        borderColor: 'gray.400'
                      }}
                      size="lg"
                      placeholder="Enter your email"
                    />
                  </FormControl>

                  <FormControl id="password" isRequired>
                    <FormLabel color="gray.700" fontWeight="500">
                      Password
                    </FormLabel>
                    <InputGroup size="lg">
                      <Input 
                        type={showPassword ? 'text' : 'password'}
                        bg={useColorModeValue('gray.50', 'gray.600')} 
                        borderColor={useColorModeValue('gray.300', 'gray.500')}
                        _focus={{
                          borderColor: 'gray.500',
                          boxShadow: '0 0 0 1px #4A5568',
                          bg: 'white'
                        }}
                        _hover={{
                          borderColor: 'gray.400'
                        }}
                        placeholder="Enter your password"
                        pr="4.5rem"
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          icon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          variant="ghost"
                          onClick={() => setShowPassword(!showPassword)}
                          size="sm"
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  {!isLogin && (
                    <FormControl id="confirmPassword" isRequired>
                      <FormLabel color="gray.700" fontWeight="500">
                        Confirm Password
                      </FormLabel>
                      <InputGroup size="lg">
                        <Input 
                          type={showConfirmPassword ? 'text' : 'password'}
                          bg={useColorModeValue('gray.50', 'gray.600')} 
                          borderColor={useColorModeValue('gray.300', 'gray.500')}
                          _focus={{
                            borderColor: 'gray.500',
                            boxShadow: '0 0 0 1px #4A5568',
                            bg: 'white'
                          }}
                          _hover={{
                            borderColor: 'gray.400'
                          }}
                          placeholder="Confirm your password"
                          pr="4.5rem"
                        />
                        <InputRightElement>
                          <IconButton
                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                            icon={showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            variant="ghost"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            size="sm"
                          />
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                  )}

                  {isLogin && (
                    <Flex justifyContent="flex-end" width="100%">
                      <Link fontSize="sm" color="gray.500" href="#" _hover={{ color: 'gray.700' }}>
                        Forgot your password?
                      </Link>
                    </Flex>
                  )}

                  <Button 
                    type="submit" 
                    bg="gray.800" 
                    color="white"
                    _hover={{ bg: 'gray.700', transform: 'translateY(-1px)' }}
                    _active={{ transform: 'translateY(0)' }}
                    width="100%" 
                    size="lg"
                    fontWeight="600"
                    isLoading={isLoading}
                    loadingText={isLogin ? 'Signing In...' : 'Creating Account...'}
                    transition="all 0.2s"
                  >
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </Button>

                  <Flex align="center" width="100%">
                    <Divider />
                    <Text px={4} color="gray.500" fontSize="sm" fontWeight="500">
                      OR
                    </Text>
                    <Divider />
                  </Flex>

                  <Button 
                    width="100%" 
                    variant="outline" 
                    borderColor="gray.300" 
                    size="lg"
                    _hover={{ 
                      bg: 'gray.50', 
                      borderColor: 'gray.400',
                      transform: 'translateY(-1px)'
                    }}
                    _active={{ transform: 'translateY(0)' }}
                    fontWeight="500"
                    transition="all 0.2s"
                  >
                    <Icon viewBox="0 0 24 24" mr={3} boxSize={5}>
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </Icon>
                    Continue with Google
                  </Button>

                  <Text textAlign="center" color="gray.600" fontSize="sm">
                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                    <Link 
                      as={RouterLink} 
                      to={isLogin ? '/signup' : '/login'} 
                      color="gray.800" 
                      fontWeight="600"
                      _hover={{ textDecoration: 'underline' }}
                    >
                      {isLogin ? 'Create one' : 'Sign in'}
                    </Link>
                  </Text>

                  {!isLogin && (
                    <Text fontSize="xs" color="gray.500" textAlign="center" lineHeight="1.5">
                      By creating an account, you agree to our{' '}
                      <Link href="#" color="gray.700" fontWeight="500">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="#" color="gray.700" fontWeight="500">
                        Privacy Policy
                      </Link>
                    </Text>
                  )}
                </VStack>
              </form>
            </Box>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthPage;