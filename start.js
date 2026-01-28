require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('SERVER STARTED!');
  console.log('='.repeat(50));
  console.log(`Home:  http://localhost:${PORT}/home`);
  console.log(`API:   http://localhost:${PORT}/api/todos`);
  console.log(`Add:   http://localhost:${PORT}/todos/new`);
  console.log('='.repeat(50));
  console.log('Press Ctrl+C to stop\n');
});