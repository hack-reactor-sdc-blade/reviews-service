import emptyStar from '../../public/images/airbnb-empty-star.png';
import halfStar from '../../public/images/airbnb-half-star.png';
import fullStar from '../../public/images/airbnb-full-star.png';
import React from 'react';

class RatingStars extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rating: null,
      categories: ['accuracy', 'communication', 'cleanliness', 'location', 'check-in', 'value']
    }
  }

  componentDidMount() {
    this.calculateRating(this.props.reviews);
    this.renderCategoryStars();
  }

  calculateRating(reviews) {
    let total = 0;
    let average;
    
    for (let i = 0; i < reviews.length; i++) {
      total += reviews[i].rating;
    }

    average = total / reviews.length;
    let firstDigit = Number(average.toString()[0]);

    if (.5 - (average - firstDigit) > -.25 && .5 - (average - firstDigit) <= .25) {
      average = firstDigit + .5;
    } else {
      average = firstDigit;
    }

    this.setState({
      rating: average + 1.5
    }, () => { this.renderStars() });
  }

  renderStars() {
    let rating = this.state.rating;

    for (let i = 0; i < 5; i++) {
      let star = document.getElementById(`star${i}`);
      if (rating - i >= 1) {
        star.setAttribute("src", fullStar);
      } else if (rating - i === .5) {
        star.setAttribute("src", halfStar);
      } else {
        star.setAttribute("src", emptyStar);
      }
    }
  }

  calculateCategoryRatings(rating) {
    let firstDigit = Number(rating.toString()[0]);

    if (.5 - (rating - firstDigit) > -.25 && .5 - (rating - firstDigit) <= .25) {
      return firstDigit + .5;
    } else {
      return firstDigit;
    }
  }

  renderCategoryStars() {
    let categories = this.state.categories;

    for (let i = 0; i < categories.length; i++) {
      for (let j = 0; j < 5; j++) {
        let star = document.getElementsByClassName(`${categories[i]}-category-star${j}`);
        if (this.calculateCategoryRatings(Math.random() * 2 + 4) - j >= 1) {
          star[0].setAttribute("src", fullStar);
        } else if (this.calculateCategoryRatings(Math.random() * 2 + 4) - j === .5) {
          star[0].setAttribute("src", halfStar);
        } else {
          star[0].setAttribute("src", emptyStar);
        }
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <div id="star-container">
          <img id="star0"></img>
          <img id="star1"></img>
          <img id="star2"></img>
          <img id="star3"></img>
          <img id="star4"></img>
        </div>
        <div className="rating-category-container">
          <div className="first-column">
            <div className="rating-category">Accurary
              <div className="left-star-category-container">
                <img className="accuracy-category-star0"></img>
                <img className="accuracy-category-star1"></img>
                <img className="accuracy-category-star2"></img>
                <img className="accuracy-category-star3"></img>
                <img className="accuracy-category-star4"></img>
              </div>
            </div>
            <br/>           
            <div className="rating-category">Communication
              <div className="left-star-category-container">
                <img className="communication-category-star0"></img>
                <img className="communication-category-star1"></img>
                <img className="communication-category-star2"></img>
                <img className="communication-category-star3"></img>
                <img className="communication-category-star4"></img>
              </div>
            </div>
            <br/>
            <div className="rating-category">Cleanliness
              <div className="left-star-category-container">
                <img className="cleanliness-category-star0"></img>
                <img className="cleanliness-category-star1"></img>
                <img className="cleanliness-category-star2"></img>
                <img className="cleanliness-category-star3"></img>
                <img className="cleanliness-category-star4"></img>
              </div>
            </div>
          </div>
          <div className="second-column">
            <div className="rating-category">Location
              <div className="right-star-category-container">
                <img className="location-category-star0"></img>
                <img className="location-category-star1"></img>
                <img className="location-category-star2"></img>
                <img className="location-category-star3"></img>
                <img className="location-category-star4"></img>
              </div>
            </div>
            <br/>
            <div className="rating-category">Check-in
              <div className="right-star-category-container">
                <img className="check-in-category-star0"></img>
                <img className="check-in-category-star1"></img>
                <img className="check-in-category-star2"></img>
                <img className="check-in-category-star3"></img>
                <img className="check-in-category-star4"></img>
              </div>
            </div>
            <br/>
            <div className="rating-category">Value
              <div className="right-star-category-container">
                <img className="value-category-star0"></img>
                <img className="value-category-star1"></img>
                <img className="value-category-star2"></img>
                <img className="value-category-star3"></img>
                <img className="value-category-star4"></img>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default RatingStars;