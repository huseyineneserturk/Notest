import React, { useState } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Box,
  Flex,
  Text,
  Input,
  Button,
  InputGroup,
  InputRightElement,
  useColorModeValue,
  useToast,
  Spinner
} from '@chakra-ui/react';
import { Send } from 'lucide-react';
import { aiApi, ApiError } from '../utils/api';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

interface Note {
  id?: string;
  title?: string;
  content?: string;
}

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  note?: Note | null;
}

const ChatDrawer = ({ isOpen, onClose, note }: ChatDrawerProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `Hi there! I'm your Notest AI Assistant. Ask me anything about your note${note?.title ? ` on "${note.title}"` : ''}.`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSend = async () => {
    if (!input.trim() || !note?.id || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message
    const newUserMessage: Message = {
      sender: 'user',
      text: userMessage
    };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      setIsLoading(true);
      
      // Call real AI API
      const response = await aiApi.chat(note.id, userMessage);
      
      const aiResponse: Message = {
        sender: 'ai',
        text: response.response
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Failed to get AI response';
      
      const errorResponse: Message = {
        sender: 'ai',
        text: `Sorry, I encountered an error: ${errorMessage}. Please try again.`
      };
      
      setMessages(prev => [...prev, errorResponse]);
      
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

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
          Notest AI Assistant
        </DrawerHeader>
        <DrawerBody p={0} display="flex" flexDirection="column">
          <Box flex="1" overflowY="auto" p={4}>
            {messages.map((message, index) => (
              <Flex
                key={index}
                mb={4}
                justify={message.sender === 'user' ? 'flex-end' : 'flex-start'}
              >
                <Box
                  maxW="80%"
                  bg={message.sender === 'user'
                    ? useColorModeValue('gray.100', 'gray.600')
                    : useColorModeValue('white', 'gray.700')
                  }
                  borderRadius="lg"
                  p={3}
                  borderWidth={message.sender === 'ai' ? '1px' : '0'}
                  borderColor={useColorModeValue('gray.200', 'gray.600')}
                  boxShadow={message.sender === 'ai' ? 'sm' : 'none'}
                >
                  <Text fontSize="sm" lineHeight="1.5">
                    {message.text}
                  </Text>
                </Box>
              </Flex>
            ))}
          </Box>
          <Box
            p={4}
            borderTopWidth="1px"
            borderColor={useColorModeValue('gray.200', 'gray.600')}
            bg={useColorModeValue('gray.50', 'gray.700')}
          >
            <InputGroup>
              <Input
                placeholder={isLoading ? "AI is thinking..." : "Ask a question about your notes..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                _focus={{ borderColor: 'blue.500' }}
                bg={useColorModeValue('white', 'gray.600')}
                isDisabled={isLoading}
              />
              <InputRightElement>
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={handleSend}
                  variant="ghost"
                  _hover={{ bg: 'blue.100' }}
                  isDisabled={!input.trim() || isLoading}
                  isLoading={isLoading}
                >
                  {isLoading ? <Spinner size="sm" /> : <Send size={16} />}
                </Button>
              </InputRightElement>
            </InputGroup>
            
            {isLoading && (
              <Flex align="center" justify="center" mt={2}>
                <Spinner size="sm" color="blue.500" mr={2} />
                <Text fontSize="sm" color="gray.500">
                  AI is analyzing your note...
                </Text>
              </Flex>
            )}
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default ChatDrawer;