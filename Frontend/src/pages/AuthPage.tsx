import React, { useState, useEffect } from 'react';
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
  IconButton,
  useToast
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { ApiError } from '../utils/api';

const AuthPage = ({ isLogin = false }: { isLogin?: boolean }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });

  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: 'Password mismatch',
            description: 'Passwords do not match.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return;
        }

        await register(formData.email, formData.password, formData.displayName);
        toast({
          title: 'Account created!',
          description: 'Your account has been created successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'An unexpected error occurred';
      
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
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
                  {!isLogin && (
                    <FormControl id="displayName" isRequired>
                      <FormLabel color="gray.700" fontWeight="500">
                        Full Name
                      </FormLabel>
                      <Input 
                        name="displayName"
                        type="text" 
                        value={formData.displayName}
                        onChange={handleInputChange}
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
                        placeholder="Enter your full name"
                      />
                    </FormControl>
                  )}
                  
                  <FormControl id="email" isRequired>
                    <FormLabel color="gray.700" fontWeight="500">
                      Email Address
                    </FormLabel>
                    <Input 
                      name="email"
                      type="email" 
                      value={formData.email}
                      onChange={handleInputChange}
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
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
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
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
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