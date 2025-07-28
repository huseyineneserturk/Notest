import React from 'react';
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
  VStack
} from '@chakra-ui/react';
import { Circle } from 'lucide-react';

interface Note {
  id?: string;
  title?: string;
  content?: string;
}

interface SummaryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  note?: Note | null;
}

const SummaryDrawer = ({ isOpen, onClose, note }: SummaryDrawerProps) => {
  // Mock summary data - In real app, this would come from AI processing
  const summary = [
    'Algebra uses symbols and rules to manipulate those symbols',
    'Variables are symbols that represent quantities without fixed values',
    'Elementary algebra uses Latin and Greek letters as symbols',
    'Algebra is foundational to many other branches of mathematics'
  ];

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
          <VStack spacing={6} align="start">
            <Box>
              <Text mb={2} fontWeight="500" color="gray.700">
                AI-Generated Summary
              </Text>
              <Text fontSize="sm" fontStyle="italic" color="gray.500">
                {note?.title ? `Summary of "${note.title}"` : 'Summary of your note'}
              </Text>
            </Box>

            <Box w="full">
              <Text mb={4} fontSize="sm" fontWeight="500" color="gray.600">
                Key Points:
              </Text>
              <List spacing={4}>
                {summary.map((point, index) => (
                  <ListItem key={index} display="flex" alignItems="flex-start">
                    <ListIcon
                      as={Circle}
                      color="gray.400"
                      fontSize="8px"
                      mt={2}
                      mr={3}
                      fill="currentColor"
                    />
                    <Text fontSize="sm" lineHeight="1.6" color="gray.700">
                      {point}
                    </Text>
                  </ListItem>
                ))}
              </List>
            </Box>

            <Box
              w="full"
              p={4}
              bg={useColorModeValue('blue.50', 'blue.900')}
              borderRadius="md"
              borderLeft="4px"
              borderLeftColor="blue.400"
            >
              <Text fontSize="xs" color="blue.600" fontWeight="500">
                💡 Tip: Use this summary to quickly review key concepts before taking a quiz!
              </Text>
            </Box>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SummaryDrawer;