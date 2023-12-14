let mysql = require('mysql2');
const http = require("http")
const url = require('url')

let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "hrgpakxg01",
  database: "mydb"
});

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  if (req.method === 'OPTIONS') {
    res.end();
    return;
}

  if (req.method === "POST" && parsedUrl.path === "/login") {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    let body = '';

    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
      const formData = new URLSearchParams(body);
      const username = formData.get('username');
      const password = formData.get('password');

      const query = `SELECT * FROM users WHERE username = '${username}';`

      // Connect to MYSQL database to validate login
      con.connect(function(err) {
        if (err) console.log(err);
        con.query(query, [username, password], function (err, result) {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
        }

        if (result.length > 0) {
            const user = result[0];
            if (password === user.password) {
                // Successful login
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Login successful!');
            } else {
                // Invalid password
                res.writeHead(401, { 'Content-Type': 'text/plain' });
                res.end('Invalid password');
            }
        } else {
              // User not found
              res.writeHead(401, { 'Content-Type': 'text/plain' });
              res.end('User not found');
          }
          });
        });
    });
} else if (req.method === 'POST' && parsedUrl.pathname === '/newuser') {
  let body = '';
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  req.on('data', (chunk) => {
      body += chunk.toString();
  });

  req.on('end', () => {
      const formData = new URLSearchParams(body);
      const username = formData.get('username');
      const password = formData.get('password');

    const query = `INSERT INTO users (username, password) VALUES ('${username}', '${password}');`

      // Connect to MYSQL database to validate login
      con.connect(function(err) {
        if (err) throw err;
        con.query(query, function (err, result) {
          if (err) throw err;
          console.log("User Added!");
        });
      });

      // Write a 302 head with location property for automatic redirection
      res.writeHead(302, { 'Location': 'http://localhost:8080/home.html' });
      res.end();
  });
}
else if (req.method === 'POST' && parsedUrl.pathname === '/purchase') {
  let body = '';
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  req.on('data', (chunk) => {
      body += chunk.toString();
  });

  req.on('end', () => {
    const formData = new URLSearchParams(body);
    const userId = formData.get('userId')
    const destination = formData.get('destination');
    const tickets = formData.get('tickets');
    const hotelType = formData.get('hotelType');
    const creditCard = formData.get('creditCard')
    const shippingAddress = formData.get('shippingAddress')

    const query = `INSERT INTO orderhistory (UserID, Destination, Tickets, BedType, credit_card, shipping_address) VALUES ('${userId}', '${destination}', '${tickets}', '${hotelType}', '${creditCard}', '${shippingAddress}');`

    con.connect(function(err) {
      if (err) throw err;
      con.query(query, function (err, result) {
        if (err) throw err;
      });
    });

      // Write a 302 head with location property for automatic redirection
      res.writeHead(302, { 'Location': 'http://localhost:8080/home.html' });
      res.end();
  });
}
else if (req.method === 'GET' && parsedUrl.pathname === '/getDestinationPrices') {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const query = 'SELECT * FROM destination_prices';

    // Connect to MYSQL database to validate login
    con.connect(function(err) {
      if (err) throw err;
      con.query(query, function (err, result) {
        if (err) throw err;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      });
    });
}
else if (req.method === 'GET' && parsedUrl.pathname === '/getBedPrices') {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const query = 'SELECT * FROM bed_prices';

    // Connect to MYSQL database to validate login
    con.connect(function(err) {
      if (err) throw err;
      con.query(query, function (err, result) {
        if (err) throw err;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      });
    });

} else if (req.method === 'GET' && parsedUrl.pathname === '/getOrderHistory') {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  const userId = parsedUrl.query.userId
  const query = `SELECT * FROM orderhistory WHERE UserID = '${userId}'`;
  
  // Connect to MYSQL database to validate login
  con.connect(function(err) {
    if (err) throw err;
    con.query(query, function (err, result) {
      if (err) throw err;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    });
  });
} else if (req.method === 'GET' && parsedUrl.pathname === '/getUserId') {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  const username = parsedUrl.query.username
  const query = `SELECT * FROM users WHERE username = '${username}' LIMIT 1`;
  
  // Connect to MYSQL database to validate login
  con.connect(function(err) {
    if (err) throw err;
    con.query(query, function (err, result) {
      if (err) throw err;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    });
  });
}
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
}
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});