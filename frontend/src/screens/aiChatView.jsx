import { useState } from 'react';
import { Form, Button, Row, Col, Container, Card, Spinner, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Message from '../../components/message';
import axios from 'axios';

const AIChatScreen = () => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    // Add user message to conversation
    const newConversation = [...conversation, { role: 'user', content: message }];
    setConversation(newConversation);
    setMessage('');

    try {
      const { data } = await axios.post('/api/ai/chat', {
        message: message,
        context: 'Quản lý điểm danh sinh viên'
      });

      if (data.success) {
        setConversation([...newConversation, { role: 'ai', content: data.message }]);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi gửi tin nhắn');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid style={{ marginTop: '20px' }}>
      <Row className="justify-content-center">
        <Col md={10}>
          <Card>
            <Card.Header>
              <h3>🤖 Trợ lý AI - Hỗ trợ Điểm danh</h3>
              <p className="text-muted mb-0">
                Hỏi tôi bất kỳ câu hỏi nào về quản lý điểm danh, sinh viên, hoặc phân tích dữ liệu
              </p>
            </Card.Header>
            <Card.Body>
              {/* Conversation Display */}
              <div 
                style={{ 
                  maxHeight: '400px', 
                  overflowY: 'auto', 
                  marginBottom: '20px',
                  padding: '15px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px'
                }}
              >
                {conversation.length === 0 ? (
                  <div className="text-center text-muted py-5">
                    <i className="fas fa-robot fa-3x mb-3"></i>
                    <h5>Chào bạn! Tôi là trợ lý AI</h5>
                    <p>Hãy bắt đầu bằng cách đặt câu hỏi về:</p>
                    <ul className="list-inline">
                      <li className="list-inline-item">📊 Phân tích điểm danh</li>
                      <li className="list-inline-item">👥 Quản lý sinh viên</li>
                      <li className="list-inline-item">📈 Gợi ý cải thiện</li>
                      <li className="list-inline-item">⏰ Tối ưu lịch học</li>
                    </ul>
                  </div>
                ) : (
                  conversation.map((msg, index) => (
                    <div
                      key={index}
                      className={`mb-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
                    >
                      <span
                        className={`d-inline-block p-3 rounded-lg ${
                          msg.role === 'user' 
                            ? 'bg-primary text-white' 
                            : 'bg-light text-dark border'
                        }`}
                        style={{ 
                          maxWidth: '70%', 
                          textAlign: 'left',
                          borderRadius: '15px !important'
                        }}
                      >
                        <strong>{msg.role === 'user' ? 'Bạn' : 'AI'}:</strong>
                        <br />
                        {msg.content}
                      </span>
                    </div>
                  ))
                )}
                
                {loading && (
                  <div className="text-left mb-3">
                    <span className="d-inline-block p-3 rounded bg-light border">
                      <Spinner animation="border" size="sm" /> Đang xử lý...
                    </span>
                  </div>
                )}
              </div>

              {error && <Message variant="danger">{error}</Message>}

              {/* Input Form */}
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={10}>
                    <Form.Control
                      type="text"
                      placeholder="Nhập câu hỏi của bạn..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={loading}
                    />
                  </Col>
                  <Col md={2}>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="w-100"
                      disabled={loading || !message.trim()}
                    >
                      {loading ? <Spinner animation="border" size="sm" /> : 'Gửi'}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>

          {/* Quick Questions */}
          <Card className="mt-3">
            <Card.Header>
              <h5>💡 Câu hỏi gợi ý</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                {[
                  'Làm thế nào để cải thiện tỷ lệ điểm danh?',
                  'Sinh viên nào cần được quan tâm đặc biệt?',
                  'Gợi ý cách tổ chức lịch học hiệu quả',
                  'Phân tích xu hướng điểm danh trong tháng'
                ].map((question, index) => (
                  <Col md={6} key={index} className="mb-2">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="w-100 text-left"
                      onClick={() => setMessage(question)}
                      disabled={loading}
                    >
                      {question}
                    </Button>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AIChatScreen;
