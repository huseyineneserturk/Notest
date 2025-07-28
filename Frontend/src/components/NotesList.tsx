import React from 'react';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';
const NotesList = ({
  notes,
  activeNoteId,
  onNoteSelect
}) => {
  return <Box>
      {notes.map(note => <Box key={note.id} p={3} cursor="pointer" bg={note.id === activeNoteId ? useColorModeValue('gray.100', 'gray.600') : 'transparent'} _hover={{
      bg: note.id !== activeNoteId ? useColorModeValue('gray.50', 'gray.700') : null
    }} borderBottomWidth="1px" borderColor={useColorModeValue('gray.100', 'gray.600')} onClick={() => onNoteSelect(note)}>
          <Text fontWeight={note.id === activeNoteId ? 'medium' : 'normal'} noOfLines={1}>
            {note.title}
          </Text>
        </Box>)}
    </Box>;
};
export default NotesList;