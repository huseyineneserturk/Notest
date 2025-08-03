import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  Flex, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Button, 
  useColorModeValue, 
  Spinner, 
  Center,
  Badge,
  useToast
} from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Header from '../components/Header';
import { authApi, ApiError } from '../utils/api';

const PerformanceHistory = () => {
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [quizHistory, setQuizHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      setIsLoading(true);
      const response = await authApi.getPerformanceHistory();
      setPerformanceData(response.performanceData);
      setQuizHistory(response.quizHistory);
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Failed to fetch performance history';
      
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Box width="100%" minHeight="100vh" bg={useColorModeValue('gray.50', 'gray.800')}>
      <Header />
      
      <Container maxW="container.lg" py={8}>
        <Heading as="h1" size="xl" mb={8} color="gray.800">
          Performance History
        </Heading>
        
        {isLoading ? (
          <Center py={20}>
            <Spinner size="xl" color="gray.800" />
          </Center>
        ) : (
          <>
            <Box mb={8} bg={useColorModeValue('white', 'gray.700')} p={6} borderRadius="lg" borderWidth="1px" borderColor={useColorModeValue('gray.200', 'gray.600')}>
              <Heading as="h2" size="md" mb={4} color="gray.700">
                Quiz Performance by Notebook
              </Heading>
              
              {performanceData.length > 0 ? (
                <Box height="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#4A5568' }} 
                        axisLine={{ stroke: '#E2E8F0' }} 
                      />
                      <YAxis 
                        tick={{ fill: '#4A5568' }} 
                        axisLine={{ stroke: '#E2E8F0' }} 
                        domain={[0, 100]}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Average Score']}
                        labelStyle={{ color: '#4A5568' }}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #E2E8F0',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="score" fill="#4A5568" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Center py={10}>
                  <Text color="gray.500">No quiz data available yet. Take some quizzes to see your performance!</Text>
                </Center>
              )}
            </Box>
          </>
        )}
        {!isLoading && (
          <Box bg={useColorModeValue('white', 'gray.700')} borderRadius="lg" borderWidth="1px" borderColor={useColorModeValue('gray.200', 'gray.600')} overflow="hidden">
            <Flex p={4} borderBottomWidth="1px" borderColor={useColorModeValue('gray.100', 'gray.600')} justify="space-between" align="center">
              <Heading as="h2" size="md" color="gray.700">
                Quiz History ({quizHistory.length} quizzes)
              </Heading>
            </Flex>
            
            {quizHistory.length > 0 ? (
              <Table variant="simple">
                <Thead bg={useColorModeValue('gray.50', 'gray.600')}>
                  <Tr>
                    <Th>Notebook</Th>
                    <Th>Note</Th>
                    <Th>Date</Th>
                    <Th>Score</Th>
                    <Th>Status</Th>
                    <Th>Questions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {quizHistory.map(quiz => (
                    <Tr key={quiz.id}>
                      <Td fontWeight="medium">{quiz.notebook}</Td>
                      <Td color="gray.600">{quiz.noteTitle}</Td>
                      <Td>{formatDate(quiz.date)}</Td>
                      <Td>
                        <Text fontWeight="bold" color={parseInt(quiz.score) >= 70 ? 'green.600' : 'red.600'}>
                          {quiz.score}
                        </Text>
                      </Td>
                      <Td>
                        <Badge 
                          colorScheme={quiz.passed ? 'green' : 'red'} 
                          variant="subtle"
                        >
                          {quiz.passed ? 'Passed' : 'Failed'}
                        </Badge>
                      </Td>
                      <Td color="gray.600">{quiz.totalQuestions} questions</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Center py={10}>
                <Text color="gray.500">No quiz history yet. Take your first quiz to see it here!</Text>
              </Center>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default PerformanceHistory;