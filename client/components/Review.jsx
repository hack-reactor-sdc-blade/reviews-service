import Response from './Response.jsx';
import React from 'react';

class Review extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: true,
    }

    this.readMore = this.readMore.bind(this);
    this.renderReviews = this.renderReviews.bind(this);
    this.appendResponses = this.appendResponses.bind(this);
  }

  handleClick(i, text) {
    let review = document.getElementsByClassName(`read-more${i}`);
    let lessText = review[0].innerText.slice(0, -13);

    return review[0].innerText = lessText + text;
  }

  readMore(index, text) {
    if (text.length > 280) {
      for (let i = 280; i > 0; i--) {
        if (text[i + 1] === ' ') {
          var lessText = text.slice(0, i + 1) + '...';
          var moreText = text.slice(i + 1, text.length);
          break;
        } 
      }
      return (
        <React.Fragment>
          {lessText} <button className="read-more-button" onClick={() => this.handleClick(index, moreText)}>Read more</button>
        </React.Fragment>
      );
    } else {
      return text;
    }
  }

  renderReviews() {
    if (this.props.searchedReviews.length) {
      return this.props.searchedReviews;
    }
    return this.props.paginatedReviews;
  }

  appendResponses(i) {
    let reviews = this.props.allReviews;
    let searchedReviews = this.props.searchedReviews;
    let paginatedReviews = this.props.paginatedReviews;
    let owner = reviews[reviews.length - 1];
    let ownerResponse = reviews[i].owner_response;
    let date = () => {
      if (searchedReviews.length) {
        return searchedReviews[i].date;
      }
      return paginatedReviews[i].date;
    }

    if (reviews[i].has_response) {
      return <Response review={owner} response={ownerResponse} date={date()} />
    }  
  }


  render() {
    return (
      <div>
        {this.renderReviews().map((review, i) => {
          return (
            <div key={review.text} className="review-container">
              <div className="header-container">
                <div>
                  <img className="avatar" src={`${review.avatar}`}/>
                </div>
                <div className="name">
                  <div>{review.name}</div> 
                </div>
                <div className="date">
                  <div>{review.date}</div>
                </div>
              </div>
              <div className="text">
                <div className={`read-more${i}`}>
                  {this.readMore(i, review.text)}
                </div>
                <div className={`owner-response${i}`}>
                  {this.appendResponses(i)}
                </div>
              </div>
              <hr className="divider"/>
            </div>
          );
        })}
      </div>
    );
  }
}


export default Review;