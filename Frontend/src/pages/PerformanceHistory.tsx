import React from 'react';
import { Box, Container, Heading, Text, Flex, Table, Thead, Tbody, Tr, Th, Td, Button, useColorModeValue } from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Header from '../components/Header';

const PerformanceHistory = () => {
  // Mock data for performance history
  const performanceData = [{
    name: 'Mathematics',
    score: 85
  }, {
    name: 'Physics',
    score: 70
  }, {
    name: 'Web Dev',
    score: 90
  }, {
    name: 'ML',
    score: 65
  }, {
    name: 'History',
    score: 80
  }];

  // Mock quiz history
  const quizHistory = [{
    id: '1',
    notebook: 'Mathematics 101',
    date: '2023-05-15',
    score: '85%'
  }, {
    id: '2',
    notebook: 'Physics Fundamentals',
    date: '2023-05-10',
    score: '70%'
  }, {
    id: '3',
    notebook: 'Web Development',
    date: '2023-05-05',
    score: '90%'
  }, {
    id: '4',
    notebook: 'Machine Learning',
    date: '2023-04-28',
    score: '65%'
  }, {
    id: '5',
    notebook: 'History of Art',
    date: '2023-04-20',
    score: '80%'
  }];

  return (
    <Box width="100%" minHeight="100vh" bg={useColorModeValue('gray.50', 'gray.800')}>
      <Header />
      
      <Container maxW="container.lg" py={8}>
        <Heading as="h1" size="xl" mb={8} color="gray.800">
          Performance History
        </Heading>
        <Box mb={8} bg={useColorModeValue('white', 'gray.700')} p={6} borderRadius="lg" borderWidth="1px" borderColor={useColorModeValue('gray.200', 'gray.600')}>
          <Heading as="h2" size="md" mb={4} color="gray.700">
            Quiz Performance by Notebook
          </Heading>
          <Box height="300px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{
                fill: '#4A5568'
              }} axisLine={{
                stroke: '#E2E8F0'
              }} />
                <YAxis tick={{
                fill: '#4A5568'
              }} axisLine={{
                stroke: '#E2E8F0'
              }} />
                <Tooltip />
                <Bar dataKey="score" fill="#4A5568" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
        <Box bg={useColorModeValue('white', 'gray.700')} borderRadius="lg" borderWidth="1px" borderColor={useColorModeValue('gray.200', 'gray.600')} overflow="hidden">
          <Flex p={4} borderBottomWidth="1px" borderColor={useColorModeValue('gray.100', 'gray.600')} justify="space-between" align="center">
            <Heading as="h2" size="md" color="gray.700">
              Quiz History
            </Heading>
          </Flex>
          <Table variant="simple">
            <Thead bg={useColorModeValue('gray.50', 'gray.600')}>
              <Tr>
                <Th>Notebook</Th>
                <Th>Date</Th>
                <Th>Score</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {quizHistory.map(quiz => <Tr key={quiz.id}>
                  <Td>{quiz.notebook}</Td>
                  <Td>{quiz.date}</Td>
                  <Td fontWeight="medium">{quiz.score}</Td>
                  <Td>
                    <Button size="sm" variant="ghost">
                      View Details
                    </Button>
                  </Td>
                </Tr>)}
            </Tbody>
          </Table>
        </Box>
      </Container>
    </Box>
  );
};

export default PerformanceHistory;