import $ from 'jquery';
import React from 'react';
import axios from 'axios';
import Review from './Review.jsx';
import SearchForm from './SearchForm.jsx';
import RatingStars from './RatingStars.jsx';
import ReactPaginate from 'react-paginate';

class ReviewList extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {
      id: 0,
      offset: 0,
      reviews: [],
      pageCount: 1,
      reviewCount: 0,
      searchValue: '',
      allResults: true,
      searchedWord: '',
      searchedReviews: [],
      paginatedReviews: []
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  componentDidMount() {
    this.getReviews(window.location.pathname);
  }
  
  getReviews(id) {
    return axios({
      url: `http://ec2-3-92-200-68.compute-1.amazonaws.com:3002/room${id}`,
      method: 'get',
      params: { limit: 7, offset: this.state.offset } 
    })
    .then(({ data }) => {
      this.setState({
        id: id,
        reviewCount: data.meta.total_count,
        reviews: data.data,
        paginatedReviews: data.comments,
        pageCount: Math.ceil(data.meta.total_count / data.meta.limit)
      });
    })
    .catch((err) => { console.error('Error retrieving reviews', err) });
  }

  renderXButton() {
    let clearInputButton = document.getElementsByClassName("clear-input");

    if (this.state.searchValue !== '') {
      clearInputButton[0].style.display = "block";
    } else {
      clearInputButton[0].style.display = "none";
    }
  }

  getSearchResults(id, word) {
    axios.get(`http://ec2-3-92-200-68.compute-1.amazonaws.com:3002${id}/search/${word}`)
    .then(({ data }) => {
      console.log(data);
      this.setState({
        searchedReviews: data,
        allResults: false
      });
    })
    .then(() => {
      this.addSearchFeatures();
      this.boldSearchedWord();
    })
    .catch(err => { console.error(err) });
  }
    
  boldSearchedWord() {
    let { searchedReviews, searchedWord } = this.state;
    let regex = new RegExp(`(\\b)(${searchedWord})(\\b)`, 'gi');

    for (let i = 0; i < searchedReviews.length; i++) {
      let currentReview = document.getElementsByClassName(`read-more${i}`);
      if (searchedReviews[i].text.includes(searchedWord)) {
        currentReview[0].innerHTML = searchedReviews[i].text.replace(regex, '$1<b>$2</b>$3');
      }
    }
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    }, () => { this.renderXButton() });
  }

  handleKeyPress(e) {
    let id = this.state.id;
    let boldedWords = document.querySelectorAll("b");
    boldedWords.forEach(word => {
      word.parentNode.replaceChild(word.firstChild, word)
    });

    if (e.charCode === 13) {
      this.getSearchResults(id, e.target.value);
      this.setState({
        searchedWord: e.target.value
      });
    }
  }

  handleClick() {
    this.setState({
      allResults: true,
      searchedReviews: []
    }, () => {this.addSearchFeatures()});

    // Unbolds searched words
    let boldedWords = document.querySelectorAll("b");
    boldedWords.forEach(word => {
      word.parentNode.replaceChild(word.firstChild, word)
    });

    // Clears input form
    let input = document.getElementsByClassName("search-form");
    let clearInputButton = document.getElementsByClassName("clear-input");
    input[0].value = '';
    clearInputButton[0].style.display = "none";
  }

  handlePageClick(data) {
    let selected = data.selected;
    let offset = Math.ceil(selected * 7);
    
    this.setState({ offset: offset }, () => { this.getReviews(this.state.id) });

    $(document).ready(function(){
      $( "a.scrollLink" ).click((event) => {
          event.preventDefault();
          $("html, body").animate({ scrollTop: $('#anchor').offset().top - 15 }, 500);
      });
    });
  }

  buildHref() {
    let pageNumbers = document.getElementsByTagName('a');
    for (let i = 0; i < pageNumbers.length; i++) {
      pageNumbers[i].href = "anchor"
    }
  }

  addSearchFeatures() {
    let searchFeatures = document.getElementsByClassName("search-features");
    let categoryContainer = document.getElementsByClassName("rating-category-container");
    let showAllReviewsButton = document.getElementsByClassName("show-all-reviews");

    if (this.state.allResults === false) {
      categoryContainer[0].style.display = "none";
      searchFeatures[0].style.display = "block";
      searchFeatures[1].style.display = "block";
      showAllReviewsButton[0].style.display = "block";
    } else {

      categoryContainer[0].style.display = "flex";
      searchFeatures[0].style.display = "none";
      searchFeatures[1].style.display = "none";
      showAllReviewsButton[0].style.display = "none";
    }
  }

  render() {
    return (
      <React.Fragment>

        {/* Total Reviews */}
        <span className="total-reviews">{this.state.reviewCount} Reviews</span>

        {/* Search */}
        <SearchForm value={this.state.searchValue} handleChange={this.handleChange} handleKeyPress={this.handleKeyPress} />
        <button className="clear-input" onClick={() => {this.handleClick()}}>&#x2715;</button>

        <hr className="header-divider1"/>

        {/* Render Stars */}
        {this.state.reviews.length > 0 ? <RatingStars reviews={this.state.reviews} /> : <p style={{fontFamily: "Nunito"}}>Waiting for reviews to populate...</p>}

        <hr id="anchor" className="header-divider2"/>

        {/* Conditional Search Elements */}
        <div className="search-features">
        {this.state.searchedReviews.length} {this.state.searchedReviews.length === 1 ? 'guest has mentioned' : 'guests have mentioned'} "<strong>{this.state.searchedWord}</strong>"
        </div>
        <button className="show-all-reviews" onClick={() => {this.handleClick()}}>Back to all reviews</button>

        <hr className="search-features"/> 

        {/* Reviews */}
        <Review allReviews={this.state.reviews} paginatedReviews={this.state.paginatedReviews} searchedReviews={this.state.searchedReviews} />

        {/* Page Numbers */}
        <ReactPaginate
          previousLabel={'<'}
          nextLabel={'>'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          itemClass={'item'}
          pageClassName={'page'}
          pageCount={this.state.pageCount}
          marginPagesDisplayed={1}
          pageRangeDisplayed={3}
          hrefBuilder={this.buildHref}
          pageLinkClassName={'scrollLink'}
          previousLinkClassName={'scrollLink'}
          nextLinkClassName={'scrollLink'}
          disabledClassName={'disabledButtons'}
          onPageChange={this.handlePageClick}
          containerClassName={'pagination'}
          activeClassName={'active'}
        />
      </React.Fragment>
    );
  }
}

export default ReviewList;
