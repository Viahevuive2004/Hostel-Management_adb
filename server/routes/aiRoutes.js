import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize OpenAI client (only if API key exists)
let openai;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// AI Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Tin nhắn không được để trống' });
    }

    if (!openai) {
      return res.status(503).json({ 
        success: false, 
        message: 'Dịch vụ AI chưa được cấu hình. Vui lòng thêm OPENAI_API_KEY vào file .env' 
      });
    }

    const systemPrompt = `Bạn là trợ lý AI hỗ trợ quản lý điểm danh sinh viên. 
    Hãy trả lời bằng tiếng Việt một cách thân thiện và chuyên nghiệp.
    ${context ? `Ngữ cảnh: ${context}` : ''}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;

    res.json({ 
      success: true, 
      message: reply 
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Có lỗi xảy ra khi xử lý yêu cầu AI' 
    });
  }
});

// AI Suggestions endpoint
router.post('/suggestions', async (req, res) => {
  try {
    const { type, data } = req.body;

    if (!type) {
      return res.status(400).json({ success: false, message: 'Loại gợi ý không được để trống' });
    }

    if (!openai) {
      return res.status(503).json({ 
        success: false, 
        message: 'Dịch vụ AI chưa được cấu hình. Vui lòng thêm OPENAI_API_KEY vào file .env' 
      });
    }

    let prompt = '';
    
    switch (type) {
      case 'attendance_pattern':
        prompt = `Phân tích mẫu điểm danh sau và đưa ra gợi ý cải thiện bằng tiếng Việt: ${JSON.stringify(data)}`;
        break;
      case 'student_performance':
        prompt = `Đánh giá hiệu suất sinh viên và đưa ra gợi ý hỗ trợ bằng tiếng Việt dựa trên dữ liệu: ${JSON.stringify(data)}`;
        break;
      case 'schedule_optimization':
        prompt = `Gợi ý tối ưu lịch học/làm việc dựa trên dữ liệu sau bằng tiếng Việt: ${JSON.stringify(data)}`;
        break;
      default:
        prompt = `Đưa ra gợi ý hữu ích bằng tiếng Việt cho: ${JSON.stringify(data)}`;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: 'Bạn là chuyên gia phân tích dữ liệu giáo dục. Hãy đưa ra các gợi ý thực tế, khả thi bằng tiếng Việt.' 
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 800,
      temperature: 0.6,
    });

    const suggestions = completion.choices[0].message.content;

    res.json({ 
      success: true, 
      suggestions 
    });

  } catch (error) {
    console.error('AI Suggestions Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Có lỗi xảy ra khi tạo gợi ý AI' 
    });
  }
});

export default router;
