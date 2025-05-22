const { Router } = require('express');
const mainRouter = Router();

// Test
mainRouter.get('/api/v1/test', async (req, res) => {
  res.json({ message: 'Test: '});
});

module.exports = mainRouter;