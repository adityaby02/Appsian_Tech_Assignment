import React, { useState } from 'react';
import { Form, Button, Alert, InputGroup } from 'react-bootstrap';

interface TodoCreatorProps {
  onSubmit: (description: string) => Promise<void>;
  isLoading?: boolean;
}

const TodoCreator: React.FC<TodoCreatorProps> = ({ onSubmit, isLoading = false }) => {
  const [todoText, setTodoText] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!todoText.trim()) {
      setValidationError('Todo description is required');
      return;
    }

    try {
      setValidationError(null);
      await onSubmit(todoText.trim());
      setTodoText('');
    } catch (err) {
      setValidationError('Failed to create todo. Please try again.');
    }
  };

  return (
    <Form onSubmit={handleCreateTodo} className="mb-4">
      <Form.Group className="mb-3">
        <Form.Label className="fw-semibold text-dark">🎯 Create New Todo</Form.Label>
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="What needs to be done today?"
            value={todoText}
            onChange={(e) => setTodoText(e.target.value)}
            disabled={isLoading}
            className="border-end-0"
            style={{ borderRadius: '12px 0 0 12px' }}
          />
          <Button 
            variant="success" 
            type="submit" 
            disabled={isLoading || !todoText.trim()}
            style={{ borderRadius: '0 12px 12px 0' }}
          >
            {isLoading ? '📝 Adding...' : '➕ Add Todo'}
          </Button>
        </InputGroup>
      </Form.Group>
      
      {validationError && (
        <Alert variant="warning" className="border-0 bg-warning bg-opacity-10">
          <i className="bi bi-exclamation-triangle me-2"></i>{validationError}
        </Alert>
      )}
    </Form>
  );
};

export default TodoCreator;
