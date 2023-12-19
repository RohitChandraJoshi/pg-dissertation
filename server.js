import('node-fetch').then((nodeFetch) => {
  const fetch = nodeFetch.default;
  const express = require('express');
  const app = express();

  const OPENAI_API_KEY = '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';

  app.use(express.json());

  app.all('/generate-text', async (req, res) => {
    if (req.method === 'POST') {
      // Handle POST requests
      const { prompt, temperature, max_tokens } = req.body;

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          prompt,
          temperature,
          max_tokens
        })
      };

      try {
        const response = await fetch('https://api.openai.com/v1/engines/text-davinci-003/completions', requestOptions);
        const data = await response.json();

        // Log the OpenAI API response to the console
        console.log('OpenAI API Response:', data);

        res.json(data);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      // Handle other HTTP methods (e.g., GET)
      res.send('GET request to /generate-text');
    }
  });

  // Define a route for the root path
  app.get('/', (req, res) => {
    res.send('Server is running!');
  });

  const PORT = 3001;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
