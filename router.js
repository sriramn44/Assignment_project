
const express= require('express');
const router= express.Router()
const index= require('./index.js');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'root123', 
    database: 'student',

  });
  

  connection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
  });


router.get("/data", async (req, res) => {
    const { ticker, column, period } = req.query;
  
    const sqlQuery = `
    SELECT ticker, date,${column}
    FROM companydata
    WHERE ticker = '${ticker}' AND STR_TO_DATE(date, '%m/%d/%Y') >= DATE_SUB(NOW(), INTERVAL ${period} YEAR)
    ORDER BY STR_TO_DATE(date, '%m/%d/%Y') ASC;
    `;
  
    connection.query(sqlQuery, (err, results) => {
      if (err) {
        console.error('Error fetching data from MySQL:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      const data = results.map(row => ({
        ticker: row.ticker,
        date: row.date,
        [column]: row[column]
      }));
      res.json(data);
    });
  });

  
  router.get("/company/:ticker", async (req, res) => {
    let value= req.params.ticker;
    
    const sqlQuery = `
      SELECT *
      FROM companydata
      where ticker = '${value}'
    `;

    connection.query(sqlQuery,(err, results) => {
      if (err) {
        console.error('Error fetching data from MySQL:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.json(results);
    });
  });
  

module.exports=router