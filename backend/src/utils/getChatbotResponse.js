const axios = require('axios');

const getChatBotResponse = async (prompt) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const url = 'https://api.openai.com/v1/chat/completions';
  const data = {
    model: 'gpt-3.5-turbo-0125',
    messages: [
        { role: 'system', content: 'You are an assistant specialized in tourism. Only answer questions related to tourism. Please answer in Bahasa Indonesia. Please give the answer as much as you can.' },
        { role: 'user', content: prompt }
    ],
    temperature : 0.5,
    max_tokens  : 1024,
    top_p       : 1
    };
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    };
    try {
      const response = await axios.post(
        url, 
        data, 
        { headers },);
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      throw error;
    }
}

const getTopic = async (prompt) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const url = 'https://api.openai.com/v1/chat/completions';

  message = prompt.concat({ role: 'system', content: 'You will given a conversation and ask to look for the topic. Answer the topic in one sentence. Please answer in Bahasa Indonesia.' })
  console.log(message)
  const data = {
    model: 'gpt-3.5-turbo-0125',
    messages: message,
    temperature : 1,
    max_tokens  : 256,
    top_p       : 1
    };
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  };
  try {
    const response = await axios.post(
      url,
      data,
      { headers },
    );
    console.log(response.data);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = {getChatBotResponse, getTopic};