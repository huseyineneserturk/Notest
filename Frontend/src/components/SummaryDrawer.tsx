import React, { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Box,
  Text,
  List,
  ListItem,
  ListIcon,
  useColorModeValue,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  useToast
} from '@chakra-ui/react';
import { Circle } from 'lucide-react';
import { aiApi, ApiError } from '../utils/api';

interface Note {
  id?: string;
  title?: string;
  content?: string;
}

interface SummaryData {
  summary: string;
  keyPoints: string[];
  importantConcepts: string[];
  readingTime: string;
}

interface SummaryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  note?: Note | null;
}

const SummaryDrawer = ({ isOpen, onClose, note }: SummaryDrawerProps) => {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const generateSummary = async () => {
    if (!note?.id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await aiApi.generateSummary(note.id);
      setSummaryData(response.summary);
      
      toast({
        title: 'Success',
        description: 'Summary generated successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Failed to generate summary';
      
      setError(errorMessage);
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

  useEffect(() => {
    if (isOpen && note?.id) {
      generateSummary();
    }
  }, [isOpen, note?.id]);

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay bg="blackAlpha.300" />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader
          borderBottomWidth="1px"
          borderColor={useColorModeValue('gray.200', 'gray.600')}
          fontWeight="600"
        >
          Note Summary
        </DrawerHeader>
        <DrawerBody py={6}>
          {isLoading ? (
            <VStack spacing={4} align="center" justify="center" h="200px">
              <Spinner size="lg" color="blue.500" />
              <Text color="gray.500">Generating AI summary...</Text>
            </VStack>
          ) : error ? (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          ) : summaryData ? (
            <VStack spacing={6} align="start">
              <Box>
                <Text mb={3} fontWeight="600" color="gray.800" fontSize="lg">
                  Summary
                </Text>
                <Text color="gray.600" lineHeight="1.7">
                  {summaryData.summary}
                </Text>
              </Box>
              
              {summaryData.keyPoints && summaryData.keyPoints.length > 0 && (
                <Box w="full">
                  <Text mb={3} fontWeight="600" color="gray.800" fontSize="lg">
                    Key Points
                  </Text>
                  <List spacing={3}>
                    {summaryData.keyPoints.map((point, index) => (
                      <ListItem key={index} display="flex" alignItems="flex-start">
                        <ListIcon
                          as={Circle}
                          color="blue.500"
                          mt={2}
                          fontSize="6px"
                          fill="currentColor"
                          mr={3}
                        />
                        <Text color="gray.600" lineHeight="1.6">
                          {point}
                        </Text>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
              
              {summaryData.importantConcepts && summaryData.importantConcepts.length > 0 && (
                <Box w="full">
                  <Text mb={3} fontWeight="600" color="gray.800" fontSize="lg">
                    Important Concepts
                  </Text>
                  <List spacing={3}>
                    {summaryData.importantConcepts.map((concept, index) => (
                      <ListItem key={index} display="flex" alignItems="flex-start">
                        <ListIcon
                          as={Circle}
                          color="green.500"
                          mt={2}
                          fontSize="6px"
                          fill="currentColor"
                          mr={3}
                        />
                        <Text color="gray.600" lineHeight="1.6" fontWeight="500">
                          {concept}
                        </Text>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
              
              {summaryData.readingTime && (
                <Box
                  w="full"
                  p={4}
                  bg={useColorModeValue('blue.50', 'blue.900')}
                  borderRadius="md"
                  borderLeft="4px"
                  borderLeftColor="blue.400"
                >
                  <Text fontSize="sm" color="blue.700" fontWeight="500">
                    📖 Reading Time: {summaryData.readingTime}
                  </Text>
                </Box>
              )}

              <Box
                w="full"
                p={4}
                bg={useColorModeValue('green.50', 'green.900')}
                borderRadius="md"
                borderLeft="4px"
                borderLeftColor="green.400"
              >
                <Text fontSize="xs" color="green.600" fontWeight="500">
                  🤖 AI Generated Summary
                </Text>
              </Box>
            </VStack>
          ) : (
            <Text color="gray.500" textAlign="center">
              No summary available
            </Text>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SummaryDrawer;