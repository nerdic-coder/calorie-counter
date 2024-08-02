import OpenAI from 'openai';

const openai = new OpenAI({
  organization: process.env.chatOrganization,
  apiKey: process.env.chatApiKey,
});

export default async function createChatResponse(imageUrl, user) {
  const prompt = `
    I have an image of a meal. Can you calculate the approximate amount of calories in this picture? Provide a total and then a table of calories for each food item you see in the image. 
    Give me the response in JSON format with the following structure:
    {
      "foodItems": [
        {
          "name": "Hamburger",
          "calories": 490
        },
        {
          "name": "French Fries",
          "calories": 365
        },
        {
          "name": "Soft Drink",
          "calories": 200
        }
      ],
      "totalCalories": 1055
    }
    Use this structure as a template and replace the values with those calculated from the image.
  `;

  return openai.chat.completions.create({
    model: process.env.chatModel || 'gpt-4o-mini',
    user,
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant that calculates the calorie content of meals and formats the response in JSON.',
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt,
          },
          {
            type: 'image_url',
            image_url: {
              url: imageUrl,
            },
          },
        ],
      },
    ],
    response_format: {
      type: 'json_object',
    },
  });
}
