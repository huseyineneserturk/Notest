import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Flex,
  Text,
  Spinner,
  Center,
  VStack,
  HStack,
  Select,
  Radio,
  RadioGroup,
  Stack,
  useColorModeValue
} from '@chakra-ui/react';
import { Brain, Zap, Target } from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: any;
}

const QuizModal = ({ isOpen, onClose, note }: QuizModalProps) => {
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');
  const [questionType, setQuestionType] = useState('multiple-choice');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      onClose();
      // Here you would navigate to the quiz or show it
    }, 3000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(2px)" />
      <ModalContent 
        borderRadius="xl" 
        overflow="hidden"
        border="1px"
        borderColor={useColorModeValue('gray.200', 'gray.600')}
      >
        <ModalHeader 
          bg={useColorModeValue('gray.50', 'gray.700')} 
          borderBottomWidth="1px"
          borderColor={useColorModeValue('gray.200', 'gray.600')}
        >
          <HStack spacing={3}>
            <Brain size={24} color="#4A5568" />
            <Text fontWeight="700" fontSize="lg">
              Generate AI Quiz
            </Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody py={6}>
          {!isGenerating ? (
            <VStack spacing={6}>
              <Text color="gray.600" textAlign="center" lineHeight="1.6">
                Create a personalized quiz from "{note?.title || 'your note'}" 
                using AI to test your understanding.
              </Text>

              <VStack spacing={5} w="full">
                <FormControl>
                  <FormLabel fontWeight="600" color="gray.700">
                    Number of Questions
                  </FormLabel>
                  <NumberInput
                    min={1}
                    max={20}
                    value={questionCount}
                    onChange={(_, val) => setQuestionCount(val)}
                    size="lg"
                  >
                    <NumberInputField 
                      _focus={{ borderColor: 'gray.500', boxShadow: '0 0 0 1px #4A5568' }}
                      borderColor="gray.300"
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    Recommended: 5-10 questions for optimal learning
                  </Text>
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="600" color="gray.700">
                    Difficulty Level
                  </FormLabel>
                  <RadioGroup 
                    onChange={setDifficulty} 
                    value={difficulty}
                  >
                    <Stack direction="row" spacing={6}>
                      <Radio value="easy" colorScheme="gray">
                        <Text fontSize="sm">Easy</Text>
                      </Radio>
                      <Radio value="medium" colorScheme="gray">
                        <Text fontSize="sm">Medium</Text>
                      </Radio>
                      <Radio value="hard" colorScheme="gray">
                        <Text fontSize="sm">Hard</Text>
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="600" color="gray.700">
                    Question Type
                  </FormLabel>
                  <Select 
                    value={questionType} 
                    onChange={(e) => setQuestionType(e.target.value)}
                    size="lg"
                    _focus={{ borderColor: 'gray.500', boxShadow: '0 0 0 1px #4A5568' }}
                    borderColor="gray.300"
                  >
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="true-false">True/False</option>
                    <option value="mixed">Mixed Types</option>
                  </Select>
                </FormControl>
              </VStack>
            </VStack>
          ) : (
            <Center py={12}>
              <VStack spacing={6}>
                <Spinner size="xl" color="gray.500" thickness="3px" speed="0.8s" />
                <VStack spacing={2} textAlign="center">
                  <Text fontWeight="600" fontSize="lg" color="gray.700">
                    Creating Your Quiz...
                  </Text>
                  <Text color="gray.500" fontSize="sm" maxW="300px">
                    Our AI is analyzing your notes and generating {questionCount} 
                    personalized questions for you.
                  </Text>
                </VStack>
                
                <HStack spacing={4} fontSize="sm" color="gray.400">
                  <HStack spacing={1}>
                    <Zap size={14} />
                    <Text>AI Powered</Text>
                  </HStack>
                  <Text>•</Text>
                  <HStack spacing={1}>
                    <Target size={14} />
                    <Text>{difficulty} difficulty</Text>
                  </HStack>
                </HStack>
              </VStack>
            </Center>
          )}
        </ModalBody>

        <ModalFooter bg={useColorModeValue('gray.50', 'gray.700')}>
          <HStack spacing={3}>
            <Button 
              variant="ghost" 
              onClick={onClose} 
              isDisabled={isGenerating}
              _hover={{ bg: 'gray.100' }}
            >
              Cancel
            </Button>
            <Button
              bg="gray.800"
              color="white"
              _hover={{ bg: 'gray.700', transform: 'translateY(-1px)' }}
              _active={{ transform: 'translateY(0)' }}
              onClick={handleGenerate}
              isDisabled={isGenerating}
              transition="all 0.2s"
              fontWeight="600"
              leftIcon={<Brain size={16} />}
            >
              {isGenerating ? 'Generating...' : 'Generate Quiz'}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default QuizModal;