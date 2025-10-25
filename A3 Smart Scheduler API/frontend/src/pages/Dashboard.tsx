import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Project, CreateProjectRequest } from '../types';
import { ProjectService } from '../services/api';

const Dashboard: React.FC = () => {
  const [scheduleItems, setScheduleItems] = useState<Project[]>([]);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(true);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [showPlannerModal, setShowPlannerModal] = useState(false);
  const [isCreatingSchedule, setIsCreatingSchedule] = useState(false);
  const [scheduleBlueprint, setScheduleBlueprint] = useState<CreateProjectRequest>({
    title: '',
    description: ''
  });

  useEffect(() => {
    loadScheduleData();
  }, []);

  const loadScheduleData = async () => {
    try {
      setAlertMessage(null);
      const retrievedSchedules = await ProjectService.getProjects();
      setScheduleItems(retrievedSchedules);
    } catch (err: any) {
      setAlertMessage('Failed to load schedule data. Please try again.');
    } finally {
      setIsLoadingSchedule(false);
    }
  };

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!scheduleBlueprint.title.trim()) {
      setAlertMessage('Schedule title is required');
      return;
    }

    setIsCreatingSchedule(true);
    setAlertMessage(null);

    try {
      const newScheduleItem = await ProjectService.createProject(scheduleBlueprint);
      setScheduleItems(prev => [newScheduleItem, ...prev]);
      setShowPlannerModal(false);
      setScheduleBlueprint({ title: '', description: '' });
    } catch (err: any) {
      setAlertMessage(err.response?.data?.message || 'Failed to create schedule');
    } finally {
      setIsCreatingSchedule(false);
    }
  };

  const handleRemoveSchedule = async (scheduleId: string) => {
    if (!window.confirm('Are you sure you want to delete this schedule? This action cannot be undone.')) {
      return;
    }

    try {
      await ProjectService.deleteProject(scheduleId);
      setScheduleItems(prev => prev.filter(s => s.id !== scheduleId));
    } catch (err: any) {
      setAlertMessage('Failed to delete schedule');
    }
  };

  if (isLoadingSchedule) {
    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Card className="shadow-lg border-0">
              <Card.Body className="text-center py-5">
                <Spinner animation="border" role="status" variant="success">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-3 text-muted">Loading your smart schedule...</p>
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
        <Card.Header className="text-white py-4" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="mb-1 fw-bold">⏰ Smart Scheduler</h1>
              <p className="mb-0 opacity-75">Intelligent task scheduling and time management</p>
            </div>
            <Button variant="light" onClick={() => setShowPlannerModal(true)} className="fw-semibold">
              ➕ New Schedule
            </Button>
          </div>
        </Card.Header>
      </Card>

      {alertMessage && (
        <Alert variant="info" dismissible onClose={() => setAlertMessage(null)} className="border-0 shadow-sm">
          <i className="bi bi-info-circle me-2"></i>{alertMessage}
        </Alert>
      )}

      {scheduleItems.length === 0 ? (
        <Card className="text-center shadow-sm border-0 bg-light">
          <Card.Body className="py-5">
            <div className="mb-4" style={{ fontSize: '4rem' }}>⏳</div>
            <h3 className="fw-bold text-dark">Time to Get Organized!</h3>
            <p className="text-muted mb-4">Create your first smart schedule and boost productivity.</p>
            <Button variant="primary" onClick={() => setShowPlannerModal(true)} className="px-4 py-2 fw-semibold" style={{ borderRadius: '12px' }}>
              ⚡ Create Smart Schedule
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {scheduleItems.map((scheduleItem) => (
            <Col md={6} lg={4} key={scheduleItem.id} className="mb-4">
              <Card className="h-100 shadow-sm border-0" style={{ borderRadius: '15px', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <Card.Body className="d-flex flex-column p-4">
                  <div className="d-flex align-items-center mb-3">
                    <span className="me-2" style={{ fontSize: '1.5rem' }}>⏰</span>
                    <Card.Title className="mb-0 fw-bold text-dark">{scheduleItem.title}</Card.Title>
                  </div>
                  <Card.Text className="flex-grow-1 text-muted">
                    {scheduleItem.description || 'No description provided'}
                  </Card.Text>
                  <div className="mt-auto">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <Badge bg="success" className="d-flex align-items-center">
                        ✓ {scheduleItem.tasks.length} scheduled task{scheduleItem.tasks.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <div className="d-flex gap-2">
                      <Link to={`/projects/${scheduleItem.id}`} className="flex-grow-1">
                        <Button variant="info" size="sm" className="w-100" style={{ borderRadius: '10px' }}>
                          📅 View Schedule
                        </Button>
                      </Link>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleRemoveSchedule(scheduleItem.id)}
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

      {/* Create Schedule Modal */}
      <Modal show={showPlannerModal} onHide={() => setShowPlannerModal(false)} centered>
        <Modal.Header closeButton className="text-white" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
          <Modal.Title className="fw-bold">⚡ Smart Schedule Planner</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateSchedule}>
          <Modal.Body className="p-4">
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">⏰ Schedule Name *</Form.Label>
              <Form.Control
                type="text"
                value={scheduleBlueprint.title}
                onChange={(e) => setScheduleBlueprint({ ...scheduleBlueprint, title: e.target.value })}
                required
                disabled={isCreatingSchedule}
                maxLength={100}
                placeholder="Enter schedule name..."
                style={{ borderRadius: '10px' }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">📋 Schedule Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={scheduleBlueprint.description}
                onChange={(e) => setScheduleBlueprint({ ...scheduleBlueprint, description: e.target.value })}
                disabled={isCreatingSchedule}
                maxLength={500}
                placeholder="Describe your scheduling goals..."
                style={{ borderRadius: '10px' }}
              />
              <Form.Text className="text-muted">
                💡 Optional, max 500 characters
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button variant="outline-secondary" onClick={() => setShowPlannerModal(false)} disabled={isCreatingSchedule} style={{ borderRadius: '10px' }}>
              Cancel
            </Button>
            <Button variant="info" type="submit" disabled={isCreatingSchedule} style={{ borderRadius: '10px' }}>
              {isCreatingSchedule ? '⏳ Creating...' : '⚡ Create Schedule'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Dashboard;
