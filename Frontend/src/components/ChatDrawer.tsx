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
  useColorModeValue
} from '@chakra-ui/react';
import { Send } from 'lucide-react';

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

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const newUserMessage: Message = {
      sender: 'user',
      text: input
    };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        sender: 'ai',
        text: "I'm analyzing your question about your notes. Based on the content you've provided, let me help you understand this topic better. Could you be more specific about what you'd like to know?"
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
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
                placeholder="Ask a question about your notes..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                _focus={{ borderColor: 'gray.500' }}
                bg={useColorModeValue('white', 'gray.600')}
              />
              <InputRightElement>
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={handleSend}
                  variant="ghost"
                  _hover={{ bg: 'gray.100' }}
                  isDisabled={!input.trim()}
                >
                  <Send size={16} />
                </Button>
              </InputRightElement>
            </InputGroup>
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default ChatDrawer;