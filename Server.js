app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.query(`CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL);`)
    .catch(err => console.error('Error creating table:', err.stack));

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  try {
    await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
    res.redirect("/?message=Signup successful! You can now log in.&success=true");
  } catch (err) {
    res.redirect("/?message=Username already taken!&success=false");
  }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];
        if (user && bcrypt.compareSync(password, user.password)) {
            res.send(`<style>body{font-family: sans-serif; text-align: center; padding-top: 50px;}</style><h1>Welcome, ${user.username}!</h1><p>This is a real, working login system.</p><a href="/">Log out</a>`);
        } else {
            res.redirect("/?message=Invalid username or password&success=false");
        }
    } catch (err) {
         res.redirect("/?message=Server error&success=false");
    }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
```
