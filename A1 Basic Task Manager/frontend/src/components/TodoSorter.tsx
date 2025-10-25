import React from 'react';
import { ButtonGroup, Button, Badge } from 'react-bootstrap';

interface TodoSorterProps {
  activeFilter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
  taskCounts: {
    all: number;
    active: number;
    completed: number;
  };
}

const TodoSorter: React.FC<TodoSorterProps> = ({ 
  activeFilter, 
  onFilterChange, 
  taskCounts 
}) => {
  return (
    <div className="mb-4">
      <h6 className="fw-semibold text-dark mb-3">📋 Filter Todos</h6>
      <ButtonGroup className="w-100 shadow-sm">
        <Button
          variant={activeFilter === 'all' ? 'info' : 'outline-info'}
          onClick={() => onFilterChange('all')}
          className="d-flex justify-content-between align-items-center"
          style={{ borderRadius: '12px 0 0 12px' }}
        >
          <span>📋 All</span>
          <Badge bg={activeFilter === 'all' ? 'light' : 'info'} text={activeFilter === 'all' ? 'dark' : 'white'}>
            {taskCounts.all}
          </Badge>
        </Button>
        <Button
          variant={activeFilter === 'active' ? 'warning' : 'outline-warning'}
          onClick={() => onFilterChange('active')}
          className="d-flex justify-content-between align-items-center"
        >
          <span>⏳ Pending</span>
          <Badge bg={activeFilter === 'active' ? 'light' : 'warning'} text={activeFilter === 'active' ? 'dark' : 'white'}>
            {taskCounts.active}
          </Badge>
        </Button>
        <Button
          variant={activeFilter === 'completed' ? 'success' : 'outline-success'}
          onClick={() => onFilterChange('completed')}
          className="d-flex justify-content-between align-items-center"
          style={{ borderRadius: '0 12px 12px 0' }}
        >
          <span>✅ Done</span>
          <Badge bg={activeFilter === 'completed' ? 'light' : 'success'} text={activeFilter === 'completed' ? 'dark' : 'white'}>
            {taskCounts.completed}
          </Badge>
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default TodoSorter;
