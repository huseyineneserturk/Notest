import React, { useEffect, useState, useCallback } from 'react';
import { Box, Button, Container, Flex, Grid, GridItem, Heading, Text, useColorModeValue, useDisclosure, useToast, Spinner, Center } from '@chakra-ui/react';
import { Plus, Brain, MessageSquare, HelpCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import NoteEditor from '../components/NoteEditor';
import NotesList from '../components/NotesList';
import QuizModal from '../components/QuizModal';
import SummaryDrawer from '../components/SummaryDrawer';
import ChatDrawer from '../components/ChatDrawer';
import { notebooksApi, notesApi, ApiError } from '../utils/api';

interface Note {
  id: string;
  title: string;
  content: string;
  notebook_id: string;
  tags?: string[];
  word_count?: number;
  reading_time?: number;
  created_at: string;
  updated_at: string;
}

interface Notebook {
  id: string;
  title: string;
  description?: string;
  category?: string;
}

const NotebookView = () => {
  const { id: notebookId } = useParams<{ id: string }>();
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [notebook, setNotebook] = useState<Notebook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [localContent, setLocalContent] = useState('');
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const quizDisclosure = useDisclosure();
  const summaryDisclosure = useDisclosure();
  const chatDisclosure = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    if (notebookId) {
      fetchNotebook();
      fetchNotes();
    }
  }, [notebookId]);
  
  // Set first note as active if none selected
  useEffect(() => {
    if (!activeNote && notes.length > 0) {
      setActiveNote(notes[0]);
    }
  }, [notes, activeNote]);

  const fetchNotebook = async () => {
    if (!notebookId) return;
    
    try {
      const response = await notebooksApi.getById(notebookId);
      setNotebook(response.notebook);
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Failed to fetch notebook';
      
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchNotes = async () => {
    if (!notebookId) return;
    
    try {
      setIsLoading(true);
      const response = await notesApi.getByNotebook(notebookId);
      setNotes(response.notes);
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Failed to fetch notes';
      
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

  const handleNoteSelect = (note: Note) => {
    setActiveNote(note);
    setLocalContent(note.content);
  };

  const debouncedSave = useCallback(async (content: string) => {
    if (!activeNote) return;
    
    try {
      setIsSaving(true);
      const updatedNote = await notesApi.update(activeNote.id, {
        content
      });
      
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === activeNote.id ? updatedNote.note : note
        )
      );
      setActiveNote(updatedNote.note);
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Failed to save note';
      
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  }, [activeNote, toast]);

  const handleNoteChange = (content: string) => {
    setLocalContent(content);
    
    // Clear existing timeout
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    
    // Set new timeout for 1 second delay
    const timeout = setTimeout(() => {
      debouncedSave(content);
    }, 1000);
    
    setSaveTimeout(timeout);
  };

  const handleCreateNote = async () => {
    if (!notebookId) return;
    
    try {
      const newNote = await notesApi.create({
        title: 'New Note',
        content: '',
        notebookId: notebookId
      });
      
      setNotes(prevNotes => [newNote.note, ...prevNotes]);
      setActiveNote(newNote.note);
      setLocalContent(newNote.note.content);
      
      toast({
        title: 'Success',
        description: 'Note created successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Failed to create note';
      
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box width="100%" minHeight="100vh" bg={useColorModeValue('gray.50', 'gray.800')}>
      <Header />
      
      <Container maxW="container.xl" py={4}>
        <Heading as="h1" size="lg" mb={4} color="gray.800">
          {notebook?.title || 'Loading...'}
        </Heading>
        <Grid templateColumns={{
        base: '1fr',
        md: '250px 1fr'
      }} gap={4}>
          <GridItem>
            <Box bg={useColorModeValue('white', 'gray.700')} borderRadius="md" borderWidth="1px" borderColor={useColorModeValue('gray.200', 'gray.600')} height="calc(100vh - 200px)" overflow="auto">
              <Flex p={3} borderBottomWidth="1px" borderColor={useColorModeValue('gray.100', 'gray.600')}>
                <Button leftIcon={<Plus size={16} />} size="sm" width="full" colorScheme="gray" onClick={handleCreateNote}>
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
                    <NoteEditor content={localContent || activeNote.content} onChange={handleNoteChange} />
                  </Box>
                </> : <Flex height="100%" align="center" justify="center" direction="column">
                  <Text color="gray.500" mb={4}>
                    No note selected
                  </Text>
                  <Button leftIcon={<Plus size={16} />} colorScheme="gray" onClick={handleCreateNote}>
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