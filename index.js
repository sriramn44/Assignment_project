const express = require('express');

const router= require('./router.js')

const app = express();


app.use(express.json());


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  
  
app.use('/api',router)
});






