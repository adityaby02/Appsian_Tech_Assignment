import React from 'react';
import { ListGroup, Button, Form, Card, Badge } from 'react-bootstrap';
import { Task } from '../types/Task';

interface TodoCollectionProps {
  tasks: Task[];
  onToggleComplete: (id: string, isCompleted: boolean) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
  filter: 'all' | 'active' | 'completed';
}

const TodoCollection: React.FC<TodoCollectionProps> = ({ 
  tasks, 
  onToggleComplete, 
  onDeleteTask, 
  filter 
}) => {
  const displayedTodos = tasks.filter(todoItem => {
    if (filter === 'active') return !todoItem.isCompleted;
    if (filter === 'completed') return todoItem.isCompleted;
    return true;
  });

  if (displayedTodos.length === 0) {
    const emptyMessages = {
      all: { emoji: '📝', message: 'No todos yet. Create your first one!' },
      active: { emoji: '🎉', message: 'All caught up! No pending todos.' },
      completed: { emoji: '✨', message: 'No completed todos yet. Keep going!' }
    };
    
    return (
      <Card className="border-0 bg-light">
        <Card.Body className="text-center py-5">
          <div className="mb-3" style={{ fontSize: '3rem' }}>
            {emptyMessages[filter].emoji}
          </div>
          <p className="text-muted mb-0">
            {emptyMessages[filter].message}
          </p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div>
      <h6 className="fw-semibold text-dark mb-3">
        🏠 Your Todos 
        <Badge bg="secondary" className="ms-2">
          {displayedTodos.length}
        </Badge>
      </h6>
      <ListGroup className="shadow-sm">
        {displayedTodos.map((todoItem, index) => (
          <ListGroup.Item
            key={todoItem.id}
            className="d-flex justify-content-between align-items-center border-0 mb-2"
            style={{ 
              borderRadius: '12px', 
              backgroundColor: todoItem.isCompleted ? '#f8f9fa' : '#ffffff',
              border: '1px solid #e9ecef'
            }}
          >
            <div className="d-flex align-items-center flex-grow-1">
              <Form.Check
                type="checkbox"
                checked={todoItem.isCompleted}
                onChange={(e) => onToggleComplete(todoItem.id, e.target.checked)}
                className="me-3"
                style={{ transform: 'scale(1.2)' }}
              />
              <div className="d-flex align-items-center">
                <span className="me-2" style={{ fontSize: '1.2rem' }}>
                  {todoItem.isCompleted ? '✅' : '📅'}
                </span>
                <span
                  className={todoItem.isCompleted ? 'text-decoration-line-through text-muted' : 'text-dark fw-medium'}
                >
                  {todoItem.description}
                </span>
              </div>
            </div>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onDeleteTask(todoItem.id)}
              className="ms-3"
              style={{ borderRadius: '8px' }}
            >
              🗑️
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default TodoCollection;
