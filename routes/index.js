const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Todo API',
    version: '1.0.0',
    endpoints: {
      todos: '/api/todos',
      health: '/health'
    }
  });
});

module.exports = router;