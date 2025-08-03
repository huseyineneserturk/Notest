import React, { useState, useEffect } from 'react';
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
  Progress,
  useToast,
  Spinner,
  Center
} from '@chakra-ui/react';
import { Plus, Grid, List, BookOpen, Clock, Target, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import Header from '../components/Header';
import NotebookCard from '../components/NotebookCard';
import { useAuth } from '../contexts/AuthContext';
import { notebooksApi, authApi, ApiError } from '../utils/api';

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
  const [isLoading, setIsLoading] = useState(true);
  const [notebooks, setNotebooks] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ''
  });

  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch both notebooks and user stats in parallel
      const [notebooksResponse, statsResponse] = await Promise.all([
        notebooksApi.getAll(),
        authApi.getStats()
      ]);
      
      setNotebooks(notebooksResponse.notebooks);
      setUserStats(statsResponse);
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Failed to fetch dashboard data';
      
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateNotebook = async () => {
    if (!formData.title.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a notebook title',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
    setIsCreating(true);
      const response = await notebooksApi.create(formData);
      
      toast({
        title: 'Success',
        description: 'Notebook created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setNotebooks(prev => [response.notebook, ...prev]);
      setFormData({ title: '', description: '', category: '' });
      onClose();
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Failed to create notebook';
      
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Use real user stats if available, fallback to notebook-based calculation
  const totalNotes = userStats?.totalNotes ?? notebooks.reduce((sum, notebook) => sum + (notebook.stats?.noteCount || 0), 0);
  const totalQuizzes = userStats?.quizzesThisMonth ?? notebooks.reduce((sum, notebook) => sum + (notebook.stats?.quizCount || 0), 0);
  const averageScore = userStats?.averageScore ?? (notebooks.length > 0 ? Math.round(
    notebooks.reduce((sum, notebook) => sum + (notebook.stats?.lastQuizScore || 0), 0) / notebooks.length
  ) : 0);
  const studyStreak = userStats?.studyStreak ?? 0;

  return (
    <Box width="100%" minHeight="100vh" bg={useColorModeValue('gray.50', 'gray.800')}>
      <Header />
      
      <Container maxW="container.xl" py={8}>
        {/* Welcome Section */}
        <VStack spacing={8} align="stretch">
          <VStack spacing={4} align="start">
            <VStack spacing={2} align="start">
              <Heading as="h1" size="xl" color="gray.800" fontWeight="700">
                Welcome back, {user?.displayName}! 👋
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
                trend={userStats?.trends ? { 
                  value: Math.abs(userStats.trends.notesGrowth), 
                  isPositive: userStats.trends.notesGrowth >= 0 
                } : undefined}
              />
              <StatsCard
                icon={Target}
                title="Quizzes Taken"
                value={totalQuizzes.toString()}
                subtitle="This month"
                trend={userStats?.trends ? { 
                  value: Math.abs(userStats.trends.quizzesGrowth), 
                  isPositive: userStats.trends.quizzesGrowth >= 0 
                } : undefined}
              />
              <StatsCard
                icon={TrendingUp}
                title="Average Score"
                value={`${averageScore}%`}
                subtitle="Last 30 days"
                trend={userStats?.trends ? { 
                  value: Math.abs(userStats.trends.scoreGrowth), 
                  isPositive: userStats.trends.scoreGrowth >= 0 
                } : undefined}
              />
              <StatsCard
                icon={Clock}
                title="Study Streak"
                value={`${studyStreak} days`}
                subtitle="Keep it going!"
                trend={userStats?.trends ? { 
                  value: Math.abs(userStats.trends.streakGrowth), 
                  isPositive: userStats.trends.streakGrowth >= 0 
                } : undefined}
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
            {isLoading ? (
              <Center py={20}>
                <Spinner size="xl" color="gray.800" />
              </Center>
            ) : notebooks.length > 0 ? (
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={6}>
              {notebooks.map((notebook) => (
                <NotebookCard key={notebook.id} notebook={notebook} />
              ))}
            </SimpleGrid>
            ) : (
              <Center py={20}>
                <VStack spacing={4}>
                  <Text fontSize="lg" color="gray.600">
                    No notebooks yet. Create your first notebook to get started!
                  </Text>
                  <Button
                    leftIcon={<Plus size={16} />}
                    bg="gray.800"
                    color="white"
                    _hover={{ bg: 'gray.700' }}
                    onClick={onOpen}
                  >
                    Create Your First Notebook
                  </Button>
                </VStack>
              </Center>
            )}
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
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Advanced Mathematics"
                  _focus={{ borderColor: 'gray.500' }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of what you'll be studying..."
                  rows={3}
                  _focus={{ borderColor: 'gray.500' }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Category</FormLabel>
                <Input
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g., Mathematics, Science, Technology"
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