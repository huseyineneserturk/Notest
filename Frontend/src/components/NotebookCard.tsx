import React from 'react';
import {
  Box,
  Text,
  Button,
  useColorModeValue,
  VStack,
  HStack,
  Badge,
  Progress,
  Flex
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Clock, Target, BookOpen } from 'lucide-react';

interface Notebook {
  id: string;
  title: string;
  description?: string;
  updatedAt: string;
  noteCount: number;
  quizCount?: number;
  lastQuizScore?: number;
  category?: string;
  progress?: number;
}

const NotebookCard = ({ notebook }: { notebook: Notebook }) => {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.700')}
      p={6}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={useColorModeValue('gray.200', 'gray.600')}
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: 'lg',
        borderColor: useColorModeValue('gray.300', 'gray.500')
      }}
      cursor="pointer"
      position="relative"
      height="280px"
      display="flex"
      flexDirection="column"
    >
      {/* Header */}
      <VStack align="start" spacing={3} flex="1">
        <HStack justify="space-between" w="full">
          <Badge
            colorScheme="gray"
            fontSize="xs"
            px={2}
            py={1}
            borderRadius="md"
            textTransform="capitalize"
          >
            {notebook.category || 'General'}
          </Badge>
          {notebook.lastQuizScore && (
            <Text fontSize="sm" fontWeight="600" color="gray.600">
              {notebook.lastQuizScore}%
            </Text>
          )}
        </HStack>

        <VStack align="start" spacing={2} w="full">
          <Text
            fontWeight="700"
            fontSize="lg"
            color="gray.800"
            noOfLines={2}
            lineHeight="1.3"
          >
            {notebook.title}
          </Text>

          {notebook.description && (
            <Text
              fontSize="sm"
              color="gray.600"
              noOfLines={2}
              lineHeight="1.4"
            >
              {notebook.description}
            </Text>
          )}
        </VStack>

        {/* Stats */}
        <HStack spacing={4} w="full" fontSize="sm" color="gray.500">
          <HStack spacing={1}>
            <BookOpen size={14} />
            <Text>{notebook.noteCount} notes</Text>
          </HStack>
          {notebook.quizCount !== undefined && (
            <HStack spacing={1}>
              <Target size={14} />
              <Text>{notebook.quizCount} quizzes</Text>
            </HStack>
          )}
        </HStack>

        {/* Progress Bar */}
        {notebook.progress !== undefined && (
          <Box w="full">
            <Flex justify="space-between" mb={2}>
              <Text fontSize="xs" color="gray.500" fontWeight="500">
                Progress
              </Text>
              <Text fontSize="xs" color="gray.600" fontWeight="600">
                {notebook.progress}%
              </Text>
            </Flex>
            <Progress
              value={notebook.progress}
              size="sm"
              colorScheme="gray"
              bg={useColorModeValue('gray.100', 'gray.600')}
              borderRadius="full"
            />
          </Box>
        )}
      </VStack>

      {/* Footer */}
      <VStack spacing={3} mt={4}>
        <HStack justify="space-between" w="full">
          <HStack spacing={1} fontSize="xs" color="gray.400">
            <Clock size={12} />
            <Text>Updated {notebook.updatedAt}</Text>
          </HStack>
        </HStack>

        <Button
          as={RouterLink}
          to={`/notebook/${notebook.id}`}
          w="full"
          bg="gray.800"
          color="white"
          _hover={{
            bg: 'gray.700',
            transform: 'translateY(-1px)'
          }}
          _active={{ transform: 'translateY(0)' }}
          size="sm"
          fontWeight="600"
          transition="all 0.2s"
        >
          Open Notebook
        </Button>
      </VStack>
    </Box>
  );
};

export default NotebookCard;