import React from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Flex, 
  Heading, 
  Text, 
  SimpleGrid, 
  useColorModeValue,
  VStack,
  HStack,
  Badge
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { BookOpen, Brain, MessageSquare, Zap, CheckCircle, Users } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const FeatureCard = ({ icon, title, description, stats }: {
  icon: any;
  title: string;
  description: string;
  stats?: string;
}) => {
  const Icon = icon;
  return (
    <Box 
      bg={useColorModeValue('gray.50', 'gray.700')} 
      p={8} 
      borderRadius="lg" 
      transition="all 0.3s" 
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'lg',
        bg: useColorModeValue('white', 'gray.600')
      }}
      border="1px"
      borderColor={useColorModeValue('gray.200', 'gray.600')}
    >
      <Flex justifyContent="center" mb={6}>
        <Icon size={40} color="#4A5568" />
      </Flex>
      <Heading as="h3" size="md" textAlign="center" mb={3} color="gray.800">
        {title}
      </Heading>
      <Text textAlign="center" color="gray.600" mb={4} lineHeight="1.6">
        {description}
      </Text>
      {stats && (
        <Text textAlign="center" fontSize="sm" color="gray.500" fontWeight="medium">
          {stats}
        </Text>
      )}
    </Box>
  );
};


const LandingPage = () => {
  return (
    <Box width="100%">
      <Header />
      
      {/* Hero Section */}
      <Box 
        as="section" 
        py={{ base: 20, md: 32 }} 
        bg={useColorModeValue('white', 'gray.800')}
      >
        <Container maxW="container.xl">
          <Flex 
            direction="column" 
            align="center" 
            textAlign="center" 
            maxW="900px" 
            mx="auto"
          >
            <Badge 
              colorScheme="gray" 
              mb={6} 
              px={4} 
              py={2} 
              fontSize="sm" 
              borderRadius="full"
            >
              AI-Powered Learning Assistant
            </Badge>
            <Heading 
              as="h1" 
              size="3xl" 
              fontWeight="800" 
              color="gray.800" 
              mb={6}
              lineHeight="1.2"
              letterSpacing="-0.025em"
            >
              Transform Your Notes into Knowledge.{' '}
              <Text as="span" color="gray.600">
                Instantly.
              </Text>
            </Heading>
            <Text 
              fontSize="xl" 
              color="gray.600" 
              mb={10} 
              maxW="600px" 
              lineHeight="1.6"
            >
              Leverage AI to create personalized quizzes, generate intelligent summaries, 
              and chat with your study materials. Turn passive notes into active learning.
            </Text>
            <HStack spacing={4} flexWrap="wrap" justifyContent="center">
              <Button 
                as={RouterLink} 
                to="/signup" 
                size="lg" 
                bg="gray.800" 
                color="white" 
                _hover={{ bg: 'gray.700', transform: 'translateY(-2px)' }}
                _active={{ transform: 'translateY(0)' }}
                px={10}
                py={6}
                fontSize="md"
                fontWeight="600"
                transition="all 0.2s"
              >
                Start Learning Smarter
              </Button>
              <Button 
                as={RouterLink} 
                to="/login" 
                size="lg" 
                variant="outline" 
                borderColor="gray.300" 
                color="gray.700" 
                _hover={{ 
                  bg: 'gray.50', 
                  borderColor: 'gray.400',
                  transform: 'translateY(-2px)' 
                }}
                _active={{ transform: 'translateY(0)' }}
                px={10}
                py={6}
                fontSize="md"
                fontWeight="600"
                transition="all 0.2s"
              >
                Sign In
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      
      {/* Features Section */}
      <Box as="section" py={20} bg={useColorModeValue('white', 'gray.800')}>
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <VStack spacing={4} textAlign="center" maxW="600px">
              <Heading as="h2" size="xl" color="gray.800" fontWeight="700">
                Everything You Need to Excel
              </Heading>
              <Text fontSize="lg" color="gray.600" lineHeight="1.6">
                Our AI-powered platform transforms the way you study, making learning 
                more interactive, efficient, and personalized.
              </Text>
            </VStack>
            
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
              <FeatureCard 
                icon={Zap} 
                title="Instant Quiz Generation" 
                description="Transform any note into interactive quizzes within seconds. Our AI analyzes your content and creates relevant questions to test your understanding."
                stats="Average generation time: 3 seconds"
              />
              <FeatureCard 
                icon={Brain} 
                title="Smart Summaries" 
                description="Get concise, AI-generated summaries that highlight key concepts and main points. Perfect for quick reviews and last-minute studying."
                stats="Up to 80% reading time saved"
              />
              <FeatureCard 
                icon={MessageSquare} 
                title="Interactive AI Chat" 
                description="Chat with an AI assistant that knows your notes inside out. Ask questions, clarify concepts, and get immediate explanations."
                stats="24/7 instant responses"
              />
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box as="section" py={20} bg={useColorModeValue('gray.50', 'gray.700')}>
        <Container maxW="container.lg">
          <VStack spacing={16}>
            <VStack spacing={4} textAlign="center">
              <Heading as="h2" size="xl" color="gray.800" fontWeight="700">
                How It Works
              </Heading>
              <Text fontSize="lg" color="gray.600">
                Get started in three simple steps
              </Text>
            </VStack>
            
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={12}>
              <VStack spacing={4} textAlign="center">
                <Box 
                  w={12} 
                  h={12} 
                  bg="gray.800" 
                  color="white" 
                  borderRadius="full" 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center" 
                  fontWeight="bold"
                  fontSize="lg"
                >
                  1
                </Box>
                <Heading as="h3" size="md" color="gray.800">
                  Upload Your Notes
                </Heading>
                <Text color="gray.600" textAlign="center">
                  Simply paste or type your study materials into our clean, 
                  distraction-free editor.
                </Text>
              </VStack>
              
              <VStack spacing={4} textAlign="center">
                <Box 
                  w={12} 
                  h={12} 
                  bg="gray.800" 
                  color="white" 
                  borderRadius="full" 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center" 
                  fontWeight="bold"
                  fontSize="lg"
                >
                  2
                </Box>
                <Heading as="h3" size="md" color="gray.800">
                  Generate & Study
                </Heading>
                <Text color="gray.600" textAlign="center">
                  Let AI create personalized quizzes and summaries from your content. 
                  Study smarter, not harder.
                </Text>
              </VStack>
              
              <VStack spacing={4} textAlign="center">
                <Box 
                  w={12} 
                  h={12} 
                  bg="gray.800" 
                  color="white" 
                  borderRadius="full" 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center" 
                  fontWeight="bold"
                  fontSize="lg"
                >
                  3
                </Box>
                <Heading as="h3" size="md" color="gray.800">
                  Track Progress
                </Heading>
                <Text color="gray.600" textAlign="center">
                  Monitor your learning journey with detailed analytics and 
                  performance insights.
                </Text>
              </VStack>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box as="section" py={20} bg={useColorModeValue('white', 'gray.800')}>
        <Container maxW="container.lg">
          <VStack spacing={8} textAlign="center">
            <VStack spacing={4}>
              <Heading as="h2" size="xl" color="gray.800" fontWeight="700">
                Ready to Transform Your Learning?
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="500px">
                Join thousands of students who are already learning smarter with Notest.
              </Text>
            </VStack>
            <Button 
              as={RouterLink} 
              to="/signup" 
              size="lg" 
              bg="gray.800" 
              color="white" 
              _hover={{ bg: 'gray.700', transform: 'translateY(-2px)' }}
              px={10}
              py={6}
              fontSize="md"
              fontWeight="600"
            >
              Get Started for Free
            </Button>
          </VStack>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default LandingPage;