import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Alert, Spinner, Card } from 'react-bootstrap';
import TodoCreator from './components/TodoCreator';
import TodoCollection from './components/TodoCollection';
import TodoSorter from './components/TodoSorter';
import { TaskService } from './services/TaskService';
import { Task } from './types/Task';
import { useLocalStorage } from './hooks/useLocalStorage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [todoItems, setTodoItems] = useState<Task[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useLocalStorage<'all' | 'active' | 'completed'>('todoDisplayMode', 'all');

  const fetchAllTodos = useCallback(async () => {
    try {
      setErrorMessage(null);
      const retrievedTodos = await TaskService.getAllTasks();
      setTodoItems(retrievedTodos);
      
      // Save to localStorage as backup
      localStorage.setItem('todoBackup', JSON.stringify(retrievedTodos));
    } catch (err) {
      console.error('Failed to load todos:', err);
      
      // Try to load from localStorage as fallback
      const cachedTodos = localStorage.getItem('todoBackup');
      if (cachedTodos) {
        setTodoItems(JSON.parse(cachedTodos));
        setErrorMessage('Using offline data. Check your connection.');
      } else {
        setErrorMessage('Failed to load todos. Please check your connection.');
      }
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchAllTodos();
  }, [fetchAllTodos]);

  const handleAddTodo = async (todoText: string) => {
    try {
      const freshTodo = await TaskService.createTask({ description: todoText, isCompleted: false });
      setTodoItems(prev => [...prev, freshTodo]);
      
      // Update localStorage
      const updatedCollection = [...todoItems, freshTodo];
      localStorage.setItem('todoBackup', JSON.stringify(updatedCollection));
    } catch (err) {
      throw new Error('Failed to create todo');
    }
  };

  const handleToggleStatus = async (todoId: string, completionStatus: boolean) => {
    try {
      const todoToModify = todoItems.find(t => t.id === todoId);
      if (!todoToModify) return;

      const modifiedTodo = await TaskService.updateTask(todoId, {
        description: todoToModify.description,
        isCompleted: completionStatus
      });

      setTodoItems(prev => prev.map(todoItem => 
        todoItem.id === todoId ? modifiedTodo : todoItem
      ));

      // Update localStorage
      const updatedCollection = todoItems.map(todoItem => 
        todoItem.id === todoId ? modifiedTodo : todoItem
      );
      localStorage.setItem('todoBackup', JSON.stringify(updatedCollection));
    } catch (err) {
      setErrorMessage('Failed to update todo');
    }
  };

  const handleRemoveTodo = async (todoId: string) => {
    try {
      await TaskService.deleteTask(todoId);
      setTodoItems(prev => prev.filter(todoItem => todoItem.id !== todoId));
      
      // Update localStorage
      const updatedCollection = todoItems.filter(todoItem => todoItem.id !== todoId);
      localStorage.setItem('todoBackup', JSON.stringify(updatedCollection));
    } catch (err) {
      setErrorMessage('Failed to delete todo');
    }
  };

  const todoStats = {
    all: todoItems.length,
    active: todoItems.filter(t => !t.isCompleted).length,
    completed: todoItems.filter(t => t.isCompleted).length
  };

  if (isLoadingData) {
    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Card className="shadow-lg border-0">
              <Card.Body className="text-center py-5">
                <Spinner animation="border" role="status" variant="success">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-3 text-muted">Loading your todos...</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-lg border-0">
            <Card.Header className="bg-gradient text-white text-center py-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <h1 className="mb-0 fw-bold">✨ My Todo Hub</h1>
              <p className="mb-0 opacity-75">Stay organized, stay productive</p>
            </Card.Header>
            
            <Card.Body className="p-4">
              {errorMessage && (
                <Alert variant="info" dismissible onClose={() => setErrorMessage(null)} className="border-0">
                  <i className="bi bi-info-circle me-2"></i>{errorMessage}
                </Alert>
              )}
              
              <TodoCreator onSubmit={handleAddTodo} />
              
              <TodoSorter
                activeFilter={displayMode}
                onFilterChange={setDisplayMode}
                taskCounts={todoStats}
              />
              
              <TodoCollection
                tasks={todoItems}
                onToggleComplete={handleToggleStatus}
                onDeleteTask={handleRemoveTodo}
                filter={displayMode}
              />
              
              {todoItems.length > 0 && (
                <Card className="mt-4 bg-light border-0">
                  <Card.Body className="text-center py-3">
                    <small className="text-muted">
                      📋 {todoStats.active} pending • ✅ {todoStats.completed} completed
                    </small>
                  </Card.Body>
                </Card>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
