import functions from '@google-cloud/functions-framework';
import createChatResponse from './chat.js';

functions.http('calories', async (req, res) => {
  try {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Authorization');
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }
    const imageUrl = req.query.imageUrl || req.body.imageUrl;
    if (!imageUrl) {
      res.status(400).send('Missing image in request');
    }
    const completion = await createChatResponse(imageUrl, 'someone');
    res.json(JSON.parse(completion.choices[0].message.content));
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});
