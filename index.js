const express = require('express');
const supabaseClient = require('@supabase/supabase-js').createClient;
const morgan = require('morgan')
const bodyParser = require("body-parser");
const cors = require('cors');

const DB_URL = 'https://nsrpmtdlkueiljljltcr.supabase.co';
const DB_KEY ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zcnBtdGRsa3VlaWxqbGpsdGNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc3MjE4MzUsImV4cCI6MjAyMzI5NzgzNX0.4IZBkG6eYnc7vYDViBI_ayLC9jZKn3yeRXmQO6XJ0vs';
const PORT=3001;

const app = express();
// For CORS enabling
app.use(cors())


// using morgan for logs
app.use(morgan('combined'));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const supabase = supabaseClient(DB_URL, DB_KEY);

app.post('/user', async (req, res) => {
    const { user, cred } = req.body;
    let role;
    let dataUser = [];
    let querySB = supabase
        .from('users')
        .select()
    if (user) {
        querySB = querySB.eq('userid', user)
    }
    if (cred) {
        querySB = querySB.eq('password_hash', cred)
    }
    const { data, error } = await querySB;
    if (data.length) {
        role = data[0].role;
    }
    if (role === 'admin') {
        const { data, error } = await supabase
            .from('users')
            .select()
        dataUser = data;
    } else {
        dataUser = data;
    }
    res.send(dataUser);
});

app.get('/', (req, res) => {
    res.send("Hello User");
});

app.get('*', (req, res) => {
    res.send("Howdy User");
});

app.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
});
