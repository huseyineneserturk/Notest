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
  Box,
  useColorModeValue
} from '@chakra-ui/react';
import { Brain, Zap, Target } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: string;
  category: string;
}

interface QuizData {
  questions: QuizQuestion[];
}

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
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleGenerate = async () => {
    if (!note) return;
    
    setIsGenerating(true);
    try {
      console.log('Sending request to:', `${import.meta.env.VITE_API_URL}/ai/quiz`);
      console.log('Note ID:', note.id);
      console.log('Token:', localStorage.getItem('token'));
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ai/quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          noteId: note.id,
          questionCount,
          difficulty
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Failed to generate quiz: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Generated quiz:', data);
      
      // Store quiz data and show quiz interface
      setQuizData(data.quiz);
      setShowQuiz(true);
    } catch (error) {
      console.error('Quiz generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
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
          {showQuiz && quizData ? (
            <VStack spacing={6}>
              {!showResults ? (
                <>
                  <HStack justify="space-between" w="full">
                    <Text fontWeight="600" color="gray.700">
                      Question {currentQuestion + 1} of {quizData.questions.length}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {Math.round(((currentQuestion + 1) / quizData.questions.length) * 100)}% Complete
                    </Text>
                  </HStack>
                  
                  <VStack spacing={4} align="stretch" w="full">
                    <Text fontSize="lg" fontWeight="600" color="gray.800">
                      {quizData.questions[currentQuestion].question}
                    </Text>
                    
                    <RadioGroup 
                      onChange={(value) => setUserAnswers(prev => ({ ...prev, [currentQuestion]: value }))}
                      value={userAnswers[currentQuestion] || ''}
                    >
                      <VStack spacing={3} align="stretch">
                        {quizData.questions[currentQuestion].options.map((option, index) => (
                          <Radio 
                            key={index} 
                            value={String.fromCharCode(65 + index)} // A, B, C, D
                            colorScheme="gray"
                            size="lg"
                          >
                            <Text fontSize="md">{option}</Text>
                          </Radio>
                        ))}
                      </VStack>
                    </RadioGroup>
                  </VStack>
                </>
              ) : (
                <VStack spacing={6}>
                  <Text fontSize="xl" fontWeight="700" color="gray.800">
                    Quiz Results
                  </Text>
                  
                  {quizData.questions.map((question, index) => {
                    const userAnswer = userAnswers[index];
                    const isCorrect = userAnswer === question.correctAnswer;
                    
                    return (
                      <Box 
                        key={index} 
                        p={4} 
                        border="1px" 
                        borderColor={isCorrect ? 'green.200' : 'red.200'}
                        borderRadius="md"
                        bg={isCorrect ? 'green.50' : 'red.50'}
                      >
                        <VStack spacing={3} align="stretch">
                          <Text fontWeight="600" color="gray.800">
                            {question.question}
                          </Text>
                          
                          <HStack spacing={2}>
                            <Text fontSize="sm" color="gray.600">
                              Your answer: {userAnswer || 'Not answered'}
                            </Text>
                            <Text fontSize="sm" color={isCorrect ? 'green.600' : 'red.600'} fontWeight="600">
                              {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                            </Text>
                          </HStack>
                          
                          {!isCorrect && (
                            <Text fontSize="sm" color="gray.600">
                              Correct answer: {question.correctAnswer}
                            </Text>
                          )}
                          
                          <Text fontSize="sm" color="gray.700" fontStyle="italic">
                            {question.explanation}
                          </Text>
                        </VStack>
                      </Box>
                    );
                  })}
                  
                  <Text fontSize="lg" fontWeight="600" color="gray.800">
                    Score: {Object.keys(userAnswers).filter(key => 
                      userAnswers[Number(key)] === quizData.questions[Number(key)].correctAnswer
                    ).length} / {quizData.questions.length}
                  </Text>
                </VStack>
              )}
            </VStack>
          ) : !isGenerating ? (
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
            {showQuiz && quizData ? (
              <>
                {!showResults ? (
                  <>
                    <Button 
                      variant="ghost" 
                      onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                      isDisabled={currentQuestion === 0}
                      _hover={{ bg: 'gray.100' }}
                    >
                      Previous
                    </Button>
                    <Button
                      bg="gray.800"
                      color="white"
                      _hover={{ bg: 'gray.700', transform: 'translateY(-1px)' }}
                      _active={{ transform: 'translateY(0)' }}
                      onClick={() => {
                        if (currentQuestion < quizData.questions.length - 1) {
                          setCurrentQuestion(prev => prev + 1);
                        } else {
                          setShowResults(true);
                        }
                      }}
                      transition="all 0.2s"
                      fontWeight="600"
                    >
                      {currentQuestion < quizData.questions.length - 1 ? 'Next' : 'Finish Quiz'}
                    </Button>
                  </>
                ) : (
                  <Button
                    bg="gray.800"
                    color="white"
                    _hover={{ bg: 'gray.700', transform: 'translateY(-1px)' }}
                    _active={{ transform: 'translateY(0)' }}
                    onClick={onClose}
                    transition="all 0.2s"
                    fontWeight="600"
                  >
                    Close
                  </Button>
                )}
              </>
            ) : (
              <>
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
              </>
            )}
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default QuizModal;