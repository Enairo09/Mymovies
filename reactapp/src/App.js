import React, { Component } from 'react';
import Movies from './Movies';
import './App.css';

import 'bootstrap/dist/css/bootstrap.css';

import {
  Container, Row,
  Button, Col, Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink, Popover, PopoverHeader, PopoverBody
} from 'reactstrap';

class App extends Component {

  // header click instruct
  constructor(props) {
    super(props);
    this.handleClickLikeOn = this.handleClickLikeOn.bind(this);
    this.handleClickLikeOff = this.handleClickLikeOff.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      viewOnlyLike: false,
      movieCount: 0,
      movieNameList: [],
      movies: [],
      moviesLiked: []
    };
  }


  componentDidMount() {
    var ctx = this;

    //get API list of movies
    fetch('/api/movies').then(function (response) {
      return response.json();
    }).then(function (data) {
      console.log(data.body.results);
      ctx.setState({ movies: data.body.results });
    }).catch(function (error) {
      console.log('request failed', error);
    });

    //get LIKED list of movies
    fetch('/api/mymovies').then(function (response) {
      return response.json();
    }).then(function (movies) {
      var movieNameListCopy = movies.data.map((movie) => {
        return movie.title;
      });
      ctx.setState({
        moviesLiked: movies.data,
        movieCount: movies.data.length,
        movieNameList: movieNameListCopy
      });
    })
      .catch(function (error) {
        console.log('Request failed ->', error)
      });
  };

  //gerer les clicks des hearts
  handleClickLikeOff = () => {
    this.setState({ viewOnlyLike: false });
  }

  handleClickLikeOn = () => {
    this.setState({ viewOnlyLike: !this.state.viewOnlyLike });
  }

  handleClick = (isSelected, movieName) => {
    var movieNameListCopy = this.state.movieNameList.slice();
    if (isSelected === false) {
      movieNameListCopy.push(movieName)
      this.setState({
        movieCount: (this.state.movieCount + 1),
        movieNameList: movieNameListCopy
      })
      console.log('je suis la', this.state.movieCount)
    } else {
      var indexMovie = movieNameListCopy.indexOf(movieName)
      movieNameListCopy.splice(indexMovie, 1)
      this.setState({
        movieCount: (this.state.movieCount - 1),
        movieNameList: movieNameListCopy
      })
      console.log('je suis ICI', this.state.movieCount)
    }
  }


  render() {

    var movieList = this.state.movies.map((movie, i) => {
      var isLiked = false;
      for (var y = 0; y < this.state.moviesLiked.length; y++) {
        if (movie.id === this.state.moviesLiked[y].idMovieDB) {
          isLiked = true;
          break;
        }
      }
      return (<Movies
        key={i}
        movieName={movie.title}
        movieDesc={movie.overview}
        movieImg={movie.poster_path}
        idMovieDB={movie.id}
        movieLiked={isLiked}
        displayOnlyLike={this.state.viewOnlyLike}
        handleClickParent={this.handleClick} />);
    });

    return (
      <div>
        <Container>
          <Row>
            <Col>
              <Header movieLastList={this.state.movieNameList} movieCount={this.state.movieCount} handleClickParentOn={this.handleClickLikeOn} handleClickParentOff={this.handleClickLikeOff} />
            </Col>
          </Row>
          <Row>
            {movieList};
          </Row>
        </Container>
      </div>
    );
  }
}

class Header extends Component {

  constructor() {
    super();
    this.toggle = this.toggle.bind(this);
    this.toggleTwo = this.toggleTwo.bind(this);
    this.handleClickOn = this.handleClickOn.bind(this);
    this.handleClickOff = this.handleClickOff.bind(this);
    this.state = { isOpen: false, popoverOpen: false };

  }

  handleClickOn() {
    this.props.handleClickParentOn();
  }
  handleClickOff() {
    this.props.handleClickParentOff();
  }

  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  toggleTwo() {
    this.setState({ popoverOpen: !this.state.popoverOpen });
  }

  render() {


    return (
      <div>
        <Navbar color="dark" dark expand="md">
          <span className="navbar-brand">
            <img src="./logo.png" width="30" height="30" className="d-inline-block align-top" alt="logo myMoviz" />
          </span>
          <NavbarBrand style={{ color: 'white' }} href="/">MyMoviz</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.isOpen} navbar>
            <Nav className="ml-auto" navbar >
              <NavItem>
                <NavLink onClick={this.handleClickOff} style={{ color: 'white', textAlign: "right" }} href="#">All Movies</NavLink>
              </NavItem>
              <NavItem>
                <NavLink onClick={this.handleClickOn} style={{ color: 'white', textAlign: "right" }} href="#">My FavMovies</NavLink>
              </NavItem>
              <Button id="Popover1" type="button" style={{ textAlign: "right", color: 'white', backgroundColor: "transparent", borderColor: "transparent" }}>
                {this.props.movieCount} films favoris
            </Button>
              <Popover placement="bottom" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.toggleTwo}>
                <PopoverHeader>Derniers films ajoutés</PopoverHeader>
                <PopoverBody>{this.props.movieLastList.join(', ')}...</PopoverBody>
              </Popover>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default App;
