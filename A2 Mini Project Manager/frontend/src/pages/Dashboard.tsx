import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Project, CreateProjectRequest } from '../types';
import { ProjectService } from '../services/api';

const Dashboard: React.FC = () => {
  const [projectCollection, setProjectCollection] = useState<Project[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [displayCreateDialog, setDisplayCreateDialog] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [freshProject, setFreshProject] = useState<CreateProjectRequest>({
    title: '',
    description: ''
  });

  useEffect(() => {
    fetchAllProjects();
  }, []);

  const fetchAllProjects = async () => {
    try {
      setErrorMessage(null);
      const retrievedProjects = await ProjectService.getProjects();
      setProjectCollection(retrievedProjects);
    } catch (err: any) {
      setErrorMessage('Failed to load projects. Please try again.');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!freshProject.title.trim()) {
      setErrorMessage('Project title is required');
      return;
    }

    setIsCreatingProject(true);
    setErrorMessage(null);

    try {
      const brandNewProject = await ProjectService.createProject(freshProject);
      setProjectCollection(prev => [brandNewProject, ...prev]);
      setDisplayCreateDialog(false);
      setFreshProject({ title: '', description: '' });
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to create project');
    } finally {
      setIsCreatingProject(false);
    }
  };

  const handleRemoveProject = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      await ProjectService.deleteProject(projectId);
      setProjectCollection(prev => prev.filter(p => p.id !== projectId));
    } catch (err: any) {
      setErrorMessage('Failed to delete project');
    }
  };

  if (isLoadingData) {
    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Card className="shadow-lg border-0">
              <Card.Body className="text-center py-5">
                <Spinner animation="border" role="status" variant="primary">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-3 text-muted">Loading your workspace...</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <Card className="shadow-lg border-0 mb-4">
        <Card.Header className="bg-gradient text-white py-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="mb-1 fw-bold">📁 Project Workspace</h1>
              <p className="mb-0 opacity-75">Manage and organize your creative projects</p>
            </div>
            <Button variant="light" onClick={() => setDisplayCreateDialog(true)} className="fw-semibold">
              ➕ New Project
            </Button>
          </div>
        </Card.Header>
      </Card>

      {errorMessage && (
        <Alert variant="warning" dismissible onClose={() => setErrorMessage(null)} className="border-0 shadow-sm">
          <i className="bi bi-exclamation-triangle me-2"></i>{errorMessage}
        </Alert>
      )}

      {projectCollection.length === 0 ? (
        <Card className="text-center shadow-sm border-0 bg-light">
          <Card.Body className="py-5">
            <div className="mb-4" style={{ fontSize: '4rem' }}>🎨</div>
            <h3 className="fw-bold text-dark">Ready to Create?</h3>
            <p className="text-muted mb-4">Your creative workspace awaits! Start your first project today.</p>
            <Button variant="primary" onClick={() => setDisplayCreateDialog(true)} className="px-4 py-2 fw-semibold" style={{ borderRadius: '12px' }}>
              ✨ Create First Project
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {projectCollection.map((projectItem) => (
            <Col md={6} lg={4} key={projectItem.id} className="mb-4">
              <Card className="h-100 shadow-sm border-0" style={{ borderRadius: '15px', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <Card.Body className="d-flex flex-column p-4">
                  <div className="d-flex align-items-center mb-3">
                    <span className="me-2" style={{ fontSize: '1.5rem' }}>📂</span>
                    <Card.Title className="mb-0 fw-bold text-dark">{projectItem.title}</Card.Title>
                  </div>
                  <Card.Text className="flex-grow-1 text-muted">
                    {projectItem.description || 'No description provided'}
                  </Card.Text>
                  <div className="mt-auto">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <Badge bg="info" className="d-flex align-items-center">
                        📋 {projectItem.tasks.length} task{projectItem.tasks.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <div className="d-flex gap-2">
                      <Link to={`/projects/${projectItem.id}`} className="flex-grow-1">
                        <Button variant="primary" size="sm" className="w-100" style={{ borderRadius: '10px' }}>
                          🔍 View Details
                        </Button>
                      </Link>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleRemoveProject(projectItem.id)}
                        style={{ borderRadius: '10px' }}
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Create Project Dialog */}
      <Modal show={displayCreateDialog} onHide={() => setDisplayCreateDialog(false)} centered>
        <Modal.Header closeButton className="bg-gradient text-white" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Modal.Title className="fw-bold">✨ Launch New Project</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddProject}>
          <Modal.Body className="p-4">
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">🎯 Project Name *</Form.Label>
              <Form.Control
                type="text"
                value={freshProject.title}
                onChange={(e) => setFreshProject({ ...freshProject, title: e.target.value })}
                required
                disabled={isCreatingProject}
                maxLength={100}
                placeholder="Enter a creative project name..."
                style={{ borderRadius: '10px' }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">📝 Project Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={freshProject.description}
                onChange={(e) => setFreshProject({ ...freshProject, description: e.target.value })}
                disabled={isCreatingProject}
                maxLength={500}
                placeholder="Describe your project vision and goals..."
                style={{ borderRadius: '10px' }}
              />
              <Form.Text className="text-muted">
                💡 Optional, max 500 characters
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button variant="outline-secondary" onClick={() => setDisplayCreateDialog(false)} disabled={isCreatingProject} style={{ borderRadius: '10px' }}>
              Cancel
            </Button>
            <Button variant="success" type="submit" disabled={isCreatingProject} style={{ borderRadius: '10px' }}>
              {isCreatingProject ? '📝 Creating...' : '🚀 Create Project'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Dashboard;
