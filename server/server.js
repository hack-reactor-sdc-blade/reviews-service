const express = require('express');
const expressStaticGzip = require('express-static-gzip');
const morgan = require('morgan');
const path = require('path');
const util = require('util');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3002;
const axios = require('axios');
var http = require('http');
var https = require('https');
const { getReviewsFromDatabase, getSearchResultsFromDatabase } = require('../helper/helpers.js');

http.globalAgent.maxSockets = 25;
https.globalAgent.maxSockets = 25;

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

// app.get('/room/:id', (req, res) => {
//   axios.get(`http://ec2-54-172-211-135.compute-1.amazonaws.com/room/${req.params.id}`)
//   .then(results => res.send(results.data))
//   .catch(err => {console.log(err)})
// })

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

app.get('/room/:id', (req, res) => {
  getReviewsFromDatabase(req.params.id, (err, data) => {
    if (err) {
      console.error('Error retrieving reviews from database', err);
    } else {
      // let items = sortReviews(data);
      // let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      // let nextOffset = offset + 7;
      // let previousOffset = offset - 7 < 1 ? 0 : offset - 7;
      // let meta = {
      //   limit: 7,
      //   next: util.format('?limit=%s&offset=%s', 7, nextOffset),
      //   offset: req.query.offset,
      //   previous: util.format('?limit=%s&offset=%s', 7, previousOffset),
      //   total_count: items.length,
      // };
      // let json = {
      //   meta: meta,
      //   comments: getPaginatedItems(items, offset),
      //   data: data
      // };
      // return res.json(json);
      res.send(data);
    }
  });
});




// app.get('/:id/search/:word', (req, res) => {
//   axios.get(`http://ec2-54-172-211-135.compute-1.amazonaws.com/${req.params.id}/search/${req.params.word}`)
//   .then(results => res.send(results.data))
//   .catch(err => console.log(err))
// });


app.get('/:id/search/:word', (req, res) => {
  getSearchResultsFromDatabase(req.params.id, req.params.word, (err, data) => {
    if (err) {
      console.error('Error retrieving reviews from database', err)
    } else {
      res.json(sortReviews(data));
    }
  });
});

app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`);
});
