import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Flex, Grid, GridItem, Heading, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { Plus, Brain, MessageSquare, HelpCircle } from 'lucide-react';
import Header from '../components/Header';
import NoteEditor from '../components/NoteEditor';
import NotesList from '../components/NotesList';
import QuizModal from '../components/QuizModal';
import SummaryDrawer from '../components/SummaryDrawer';
import ChatDrawer from '../components/ChatDrawer';

interface Note {
  id: string;
  title: string;
  content: string;
}

const NotebookView = () => {
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [notes, setNotes] = useState([{
    id: '1',
    title: 'Introduction to Algebra',
    content: 'Algebra is a branch of mathematics dealing with symbols and the rules for manipulating those symbols. In elementary algebra, those symbols (today written as Latin and Greek letters) represent quantities without fixed values, known as variables...'
  }, {
    id: '2',
    title: 'Trigonometry Basics',
    content: 'Trigonometry is a branch of mathematics that studies relationships between side lengths and angles of triangles. The field emerged in the Hellenistic world during the 3rd century BC from applications of geometry to astronomical studies...'
  }, {
    id: '3',
    title: 'Calculus Fundamentals',
    content: 'Calculus, originally called infinitesimal calculus or "the calculus of infinitesimals", is the mathematical study of continuous change, in the same way that geometry is the study of shape and algebra is the study of generalizations of arithmetic operations...'
  }]);
  const quizDisclosure = useDisclosure();
  const summaryDisclosure = useDisclosure();
  const chatDisclosure = useDisclosure();
  
  // Set first note as active if none selected
  useEffect(() => {
    if (!activeNote && notes.length > 0) {
      setActiveNote(notes[0]);
    }
  }, [notes, activeNote]);

  const handleNoteSelect = (note: Note) => {
    setActiveNote(note);
  };

  const handleNoteChange = (content: string) => {
    if (activeNote) {
      const updatedNotes = notes.map(note => note.id === activeNote.id ? {
        ...note,
        content
      } : note);
      setNotes(updatedNotes);
      setActiveNote({
        ...activeNote,
        content
      });
    }
  };

  return (
    <Box width="100%" minHeight="100vh" bg={useColorModeValue('gray.50', 'gray.800')}>
      <Header />
      
      <Container maxW="container.xl" py={4}>
        <Heading as="h1" size="lg" mb={4} color="gray.800">
          Mathematics 101
        </Heading>
        <Grid templateColumns={{
        base: '1fr',
        md: '250px 1fr'
      }} gap={4}>
          <GridItem>
            <Box bg={useColorModeValue('white', 'gray.700')} borderRadius="md" borderWidth="1px" borderColor={useColorModeValue('gray.200', 'gray.600')} height="calc(100vh - 200px)" overflow="auto">
              <Flex p={3} borderBottomWidth="1px" borderColor={useColorModeValue('gray.100', 'gray.600')}>
                <Button leftIcon={<Plus size={16} />} size="sm" width="full" colorScheme="gray">
                  New Note
                </Button>
              </Flex>
              <NotesList notes={notes} activeNoteId={activeNote?.id} onNoteSelect={handleNoteSelect} />
            </Box>
          </GridItem>
          <GridItem>
            <Box bg={useColorModeValue('white', 'gray.700')} borderRadius="md" borderWidth="1px" borderColor={useColorModeValue('gray.200', 'gray.600')} height="calc(100vh - 200px)" display="flex" flexDirection="column">
              {activeNote ? <>
                  <Flex p={3} borderBottomWidth="1px" borderColor={useColorModeValue('gray.100', 'gray.600')} justify="space-between" align="center">
                    <Heading as="h2" size="md" color="gray.800">
                      {activeNote.title}
                    </Heading>
                    <Flex gap={2}>
                      <Button leftIcon={<HelpCircle size={16} />} size="sm" colorScheme="gray" bg="gray.800" color="white" _hover={{
                    bg: 'gray.700'
                  }} onClick={quizDisclosure.onOpen}>
                        Generate Quiz
                      </Button>
                      <Button leftIcon={<Brain size={16} />} size="sm" variant="outline" onClick={summaryDisclosure.onOpen}>
                        Summarize
                      </Button>
                      <Button leftIcon={<MessageSquare size={16} />} size="sm" variant="outline" onClick={chatDisclosure.onOpen}>
                        Chat
                      </Button>
                    </Flex>
                  </Flex>
                  <Box flex="1" overflow="auto" p={4}>
                    <NoteEditor content={activeNote.content} onChange={handleNoteChange} />
                  </Box>
                </> : <Flex height="100%" align="center" justify="center" direction="column">
                  <Text color="gray.500" mb={4}>
                    No note selected
                  </Text>
                  <Button leftIcon={<Plus size={16} />} colorScheme="gray">
                    Create a new note
                  </Button>
                </Flex>}
            </Box>
          </GridItem>
        </Grid>
      </Container>
      <QuizModal isOpen={quizDisclosure.isOpen} onClose={quizDisclosure.onClose} note={activeNote} />
      <SummaryDrawer isOpen={summaryDisclosure.isOpen} onClose={summaryDisclosure.onClose} note={activeNote} />
      <ChatDrawer isOpen={chatDisclosure.isOpen} onClose={chatDisclosure.onClose} note={activeNote} />
    </Box>
  );
};

export default NotebookView;