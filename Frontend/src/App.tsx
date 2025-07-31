import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Center, VStack, Text, Button, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Home } from 'lucide-react';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import NotebookView from './pages/NotebookView';
import PerformanceHistory from './pages/PerformanceHistory';

// 404 Page Component
const NotFoundPage = () => (
  <Center minHeight="100vh" bg={useColorModeValue('gray.50', 'gray.800')}>
    <VStack spacing={6} textAlign="center">
      <Text fontSize="6xl" fontWeight="bold" color="gray.400">
        404
      </Text>
      <VStack spacing={3}>
        <Text fontSize="xl" fontWeight="600" color="gray.700">
          Page Not Found
        </Text>
        <Text color="gray.600" maxW="400px">
          The page you're looking for doesn't exist or has been moved.
        </Text>
      </VStack>
      <Button
        as={RouterLink}
        to="/"
        leftIcon={<Home size={16} />}
        bg="gray.800"
        color="white"
        _hover={{ bg: 'gray.700' }}
      >
        Back to Home
      </Button>
    </VStack>
  </Center>
);

export function App() {
  return (
    <AuthProvider>
    <Router>
      <Box width="100%" minHeight="100vh">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage isLogin={true} />} />
          <Route path="/signup" element={<AuthPage isLogin={false} />} />
          
          {/* Protected Routes (Dashboard, Notebook, Performance) */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/notebook/:id" element={<ProtectedRoute><NotebookView /></ProtectedRoute>} />
            <Route path="/performance" element={<ProtectedRoute><PerformanceHistory /></ProtectedRoute>} />
          
          {/* Redirects */}
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/notebooks" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 - Catch all routes */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Box>
    </Router>
    </AuthProvider>
  );
}