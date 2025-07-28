import React from 'react';
import {
  Box,
  ButtonGroup,
  IconButton,
  Textarea,
  useColorModeValue,
  Divider,
  HStack,
  Text
} from '@chakra-ui/react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading,
  Type,
  Save
} from 'lucide-react';

interface NoteEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const NoteEditor = ({ content, onChange }: NoteEditorProps) => {
  return (
    <Box height="100%" display="flex" flexDirection="column">
      {/* Toolbar */}
      <Box
        p={3}
        borderBottomWidth="1px"
        borderColor={useColorModeValue('gray.200', 'gray.600')}
        bg={useColorModeValue('gray.50', 'gray.600')}
      >
        <HStack spacing={3} justify="space-between">
          <HStack spacing={1}>
            <ButtonGroup spacing={1} isAttached variant="outline" size="sm">
              <IconButton
                aria-label="Bold"
                icon={<Bold size={14} />}
                _hover={{ bg: 'gray.100' }}
                borderColor="gray.300"
              />
              <IconButton
                aria-label="Italic"
                icon={<Italic size={14} />}
                _hover={{ bg: 'gray.100' }}
                borderColor="gray.300"
              />
              <IconButton
                aria-label="Underline"
                icon={<Underline size={14} />}
                _hover={{ bg: 'gray.100' }}
                borderColor="gray.300"
              />
            </ButtonGroup>

            <Divider orientation="vertical" height="24px" />

            <ButtonGroup spacing={1} isAttached variant="outline" size="sm">
              <IconButton
                aria-label="Heading"
                icon={<Heading size={14} />}
                _hover={{ bg: 'gray.100' }}
                borderColor="gray.300"
              />
              <IconButton
                aria-label="Bullet List"
                icon={<List size={14} />}
                _hover={{ bg: 'gray.100' }}
                borderColor="gray.300"
              />
              <IconButton
                aria-label="Numbered List"
                icon={<ListOrdered size={14} />}
                _hover={{ bg: 'gray.100' }}
                borderColor="gray.300"
              />
            </ButtonGroup>
          </HStack>

          <HStack spacing={2}>
            <Text fontSize="xs" color="gray.500">
              Auto-saved
            </Text>
            <IconButton
              aria-label="Save"
              icon={<Save size={14} />}
              size="sm"
              variant="ghost"
              _hover={{ bg: 'gray.100' }}
            />
          </HStack>
        </HStack>
      </Box>

      {/* Editor Area */}
      <Box flex="1" p={4} overflow="auto">
        <Textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          minHeight="calc(100vh - 400px)"
          resize="none"
          border="none"
          _focus={{ boxShadow: 'none' }}
          placeholder="Start writing your notes here...

Use the toolbar above to format your text:
• Bold, italic, and underline
• Headings and lists
• Auto-save keeps your work safe

Happy learning! 📚"
          fontSize="md"
          lineHeight="1.6"
          color="gray.800"
          bg="transparent"
          p={0}
          fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        />
      </Box>
    </Box>
  );
};

export default NoteEditor;