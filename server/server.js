const express = require('express');
const expressStaticGzip = require('express-static-gzip');
const morgan = require('morgan');
const path = require('path');
const util = require('util');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3002;
const axios = require('axios');

app.use(morgan('dev'));
// app.use(express.static(path.join(__dirname, '../public')));
app.use('/', expressStaticGzip(path.join(__dirname, '../public'), {
  enableBrotli: true,
  customCompressions: [{
      encodingName: 'deflate',
      fileExtension: 'zz'
  }],
  orderPreference: ['br']
}));
app.use(cors());


getPaginatedItems = (items, offset) => {
  return items.slice(offset, offset + 7);
}

sortReviews = dates => {
  return dates.sort((a, b) => {
    const dateA = new Date(a.date.replace(' ', ', '));
    const dateB = new Date(b.date.replace(' ', ', '));
    return dateB - dateA;
  });
}

app.get('/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

app.get('/room/:id', (req, res) => {
  axios.get(`http://ec2-3-87-210-224.compute-1.amazonaws.com/room/${req.params.id}`)
  .then(results => res.send(results.data))
  .catch(err => {console.log(err)})
})

app.get('/:id/search/:word', (req, res) => {
  axios.get(`http://ec2-3-87-210-224.compute-1.amazonaws.com/${req.params.id}/search/${req.params.word}`)
  .then(results => res.send(results.data))
  .catch(err => console.log(err))
});

app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`);
});
