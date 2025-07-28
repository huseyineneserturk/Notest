import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Flex, 
  Heading, 
  SimpleGrid, 
  Text, 
  useColorModeValue,
  VStack,
  HStack,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useDisclosure,
  Progress
} from '@chakra-ui/react';
import { Plus, Grid, List, BookOpen, Clock, Target, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import Header from '../components/Header';
import NotebookCard from '../components/NotebookCard';

const StatsCard = ({ icon, title, value, subtitle, trend }: {
  icon: any;
  title: string;
  value: string;
  subtitle: string;
  trend?: { value: number; isPositive: boolean };
}) => {
  const Icon = icon;
  return (
    <Box
      bg={useColorModeValue('white', 'gray.700')}
      p={6}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={useColorModeValue('gray.200', 'gray.600')}
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
    >
      <Flex align="center" justify="space-between" mb={3}>
        <Icon size={24} color="#4A5568" />
        {trend && (
          <HStack spacing={1}>
            {trend.isPositive ? (
              <ArrowUp size={14} color="#10B981" />
            ) : (
              <ArrowDown size={14} color="#EF4444" />
            )}
            <Text fontSize="sm" color={trend.isPositive ? 'green.500' : 'red.500'} fontWeight="600">
              {trend.value}%
            </Text>
          </HStack>
        )}
      </Flex>
      <VStack align="start" spacing={1}>
        <Text fontSize="2xl" fontWeight="bold" color="gray.800">
          {value}
        </Text>
        <Text fontSize="md" color="gray.700" fontWeight="500">
          {title}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {subtitle}
        </Text>
      </VStack>
    </Box>
  );
};

const Dashboard = () => {
  const [viewMode, setViewMode] = useState('grid');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isCreating, setIsCreating] = useState(false);

  // Enhanced mock data for notebooks
  const notebooks = [
    {
      id: '1',
      title: 'Mathematics 101',
      description: 'Algebra, Trigonometry, and Calculus fundamentals',
      updatedAt: '2023-05-15',
      noteCount: 12,
      quizCount: 8,
      lastQuizScore: 85,
      category: 'Mathematics',
      progress: 78
    },
    {
      id: '2',
      title: 'Physics Fundamentals',
      description: 'Classical mechanics, thermodynamics, and waves',
      updatedAt: '2023-05-10',
      noteCount: 8,
      quizCount: 5,
      lastQuizScore: 92,
      category: 'Science',
      progress: 65
    },
    {
      id: '3',
      title: 'Web Development',
      description: 'HTML, CSS, JavaScript, and React fundamentals',
      updatedAt: '2023-05-05',
      noteCount: 15,
      quizCount: 12,
      lastQuizScore: 88,
      category: 'Technology',
      progress: 90
    }
  ];

  const handleCreateNotebook = async () => {
    setIsCreating(true);
    setTimeout(() => {
      setIsCreating(false);
      onClose();
    }, 1500);
  };

  const totalNotes = notebooks.reduce((sum, notebook) => sum + notebook.noteCount, 0);
  const totalQuizzes = notebooks.reduce((sum, notebook) => sum + notebook.quizCount, 0);
  const averageScore = Math.round(
    notebooks.reduce((sum, notebook) => sum + notebook.lastQuizScore, 0) / notebooks.length
  );

  return (
    <Box width="100%" minHeight="100vh" bg={useColorModeValue('gray.50', 'gray.800')}>
      <Header />
      
      <Container maxW="container.xl" py={8}>
        {/* Welcome Section */}
        <VStack spacing={8} align="stretch">
          <VStack spacing={4} align="start">
            <VStack spacing={2} align="start">
              <Heading as="h1" size="xl" color="gray.800" fontWeight="700">
                Welcome back! 👋
              </Heading>
              <Text fontSize="lg" color="gray.600">
                Continue your learning journey with your personalized notebooks.
              </Text>
            </VStack>

            {/* Quick Stats */}
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} w="full">
              <StatsCard
                icon={BookOpen}
                title="Total Notes"
                value={totalNotes.toString()}
                subtitle="Across all notebooks"
                trend={{ value: 12, isPositive: true }}
              />
              <StatsCard
                icon={Target}
                title="Quizzes Taken"
                value={totalQuizzes.toString()}
                subtitle="This month"
                trend={{ value: 8, isPositive: true }}
              />
              <StatsCard
                icon={TrendingUp}
                title="Average Score"
                value={`${averageScore}%`}
                subtitle="Last 30 days"
                trend={{ value: 5, isPositive: true }}
              />
              <StatsCard
                icon={Clock}
                title="Study Streak"
                value="7 days"
                subtitle="Keep it going!"
                trend={{ value: 15, isPositive: true }}
              />
            </SimpleGrid>
          </VStack>

          {/* Notebooks Section */}
          <Box>
            <Flex justify="space-between" align="center" mb={6}>
              <VStack spacing={1} align="start">
                <Heading as="h2" size="lg" color="gray.800" fontWeight="600">
                  My Notebooks
                </Heading>
                <Text color="gray.600">
                  {notebooks.length} notebooks • {totalNotes} total notes
                </Text>
              </VStack>
              
              <HStack spacing={4}>
                <Button
                  leftIcon={<Plus size={16} />}
                  bg="gray.800"
                  color="white"
                  _hover={{ bg: 'gray.700', transform: 'translateY(-1px)' }}
                  _active={{ transform: 'translateY(0)' }}
                  fontWeight="600"
                  onClick={onOpen}
                  transition="all 0.2s"
                >
                  Create New Notebook
                </Button>
              </HStack>
            </Flex>

            {/* Notebooks Grid */}
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={6}>
              {notebooks.map((notebook) => (
                <NotebookCard key={notebook.id} notebook={notebook} />
              ))}
            </SimpleGrid>
          </Box>
        </VStack>
      </Container>

      {/* Create Notebook Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay bg="blackAlpha.300" />
        <ModalContent>
          <ModalHeader>Create New Notebook</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Notebook Title</FormLabel>
                <Input
                  placeholder="e.g., Advanced Mathematics"
                  _focus={{ borderColor: 'gray.500' }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  placeholder="Brief description of what you'll be studying..."
                  rows={3}
                  _focus={{ borderColor: 'gray.500' }}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              bg="gray.800"
              color="white"
              _hover={{ bg: 'gray.700' }}
              onClick={handleCreateNotebook}
              isLoading={isCreating}
              loadingText="Creating..."
            >
              Create Notebook
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Dashboard;