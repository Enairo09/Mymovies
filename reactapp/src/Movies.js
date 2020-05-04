import React, { Component } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

import {
  Card, CardImg, CardText, CardBody,
  CardTitle, Col,
} from 'reactstrap';

class Movies extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = { selected: this.props.movieLiked };
  }

  handleClick() {
    console.log(this.props.idMovieDB)
    console.log(this.props.movieName)
    var ctx = this;

    //changer le statut 
    this.setState({ selected: !this.state.selected });

    //ajouter le film liké a ma base de donnée
    if (this.state.selected === false) {
      fetch('/api/mymovies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `title=${ctx.props.movieName}&overview=${ctx.props.movieDesc}&poster_path=${ctx.props.movieImg}&idMovieDB=${ctx.props.idMovieDB}`
      }).then(function (data) { console.log('this movie is saved', data) }).catch(function (error) { console.log('error', error) });
    } else {

      //supprimer le film déliké
      // if(this.state.selected === true){
      fetch(`/api/mymovies/${this.props.idMovieDB}`, {
        method: 'DELETE'
      });
    }
    //renvoyer les info au click parent
    this.props.handleClickParent(this.state.selected, this.props.movieName);
    console.log(this.state.selected);
  }

  render() {
    // color: "#FF6861"
    var styleHeart = {
      cursor: 'pointer',
      position: "absolute",
      top: 5,
      right: 5,
      color: "white"
    }

    if (this.state.selected === true) {
      styleHeart.color = "#FF6861"
    }

    var display = '';

    if (this.props.displayOnlyLike && !this.state.selected) {

      display = 'none'

    }
    return (
      <Col xs="12" sm="6" md="4" lg="3" style={{ display }}>
        <div style={{ marginBottom: 30 }}>
          <Card >

            <CardImg style={{ height: 300 }} top width="30" src={`https://image.tmdb.org/t/p/w500/${this.props.movieImg}`} alt="Card image cap" />
            <CardBody style={{ backgroundColor: 'white', height: 400, overflow: 'scroll' }}>
              <FontAwesomeIcon onClick={this.handleClick} size="1x" icon={faHeart} style={styleHeart} />
              <CardTitle style={{ fontSize: 16, textAlign: "center" }}>{this.props.movieName}</CardTitle>
              <CardText style={{ textAlign: "justify" }}>{this.props.movieDesc}</CardText>
              {/* <Button>Button</Button> */}
            </CardBody>

          </Card>
        </div>
      </Col>
    );
  };
};

export default Movies;