import express from 'express';

const app = express();
const PORT = 5050;

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
    <h1>Sample App</h1>
    <p>This is the example project for the Hooligan Testing Framework.</p>
    <a href="/contact">Contact</a>
  `);
});

app.get('/contact', (req, res) => {
  res.send(`
    <h1>Contact</h1>
    <form method="POST" action="/contact">
      <label>
        Name:
        <input name="name" />
      </label>
      <button type="submit">Submit</button>
    </form>
  `);
});

app.post('/contact', (req, res) => {
  res.send(`
    <h1>Thank you</h1>
    <p>Thanks, ${req.body.name}.</p>
    <a href="/">Back home</a>
  `);
});

app.listen(PORT, () => {
  console.log(`Sample app running at http://localhost:${PORT}`);
});
