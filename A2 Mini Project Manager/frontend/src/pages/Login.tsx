import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const redirectPath = (location.state as any)?.from?.pathname || '/dashboard';

  const handleAuthentication = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userEmail || !userPassword) {
      setAuthError('Please fill in all fields');
      return;
    }

    setIsAuthenticating(true);
    setAuthError(null);
    
    try {
      await login({ email: userEmail, password: userPassword });
      navigate(redirectPath, { replace: true });
    } catch (err: any) {
      setAuthError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <Card className="shadow-lg border-0" style={{ borderRadius: '15px' }}>
            <Card.Header className="bg-gradient text-white text-center py-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '15px 15px 0 0' }}>
              <h2 className="mb-0 fw-bold">🔑 Welcome Back</h2>
              <p className="mb-0 opacity-75">Sign in to your workspace</p>
            </Card.Header>
            <Card.Body className="p-4">
              {authError && (
                <Alert variant="warning" className="border-0 bg-warning bg-opacity-10">
                  <i className="bi bi-exclamation-triangle me-2"></i>{authError}
                </Alert>
              )}
              
              <Form onSubmit={handleAuthentication}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">📬 Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    required
                    disabled={isAuthenticating}
                    placeholder="Enter your email..."
                    style={{ borderRadius: '10px', padding: '12px' }}
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">🔒 Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    required
                    disabled={isAuthenticating}
                    placeholder="Enter your password..."
                    style={{ borderRadius: '10px', padding: '12px' }}
                  />
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 fw-semibold" 
                  disabled={isAuthenticating}
                  style={{ borderRadius: '10px', padding: '12px' }}
                >
                  {isAuthenticating ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      🔄 Signing in...
                    </>
                  ) : (
                    '🚀 Sign In'
                  )}
                </Button>
              </Form>
              
              <div className="text-center mt-4">
                <span className="text-muted">New to our platform? </span>
                <Link to="/register" className="fw-semibold text-decoration-none">🌟 Join Now</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
