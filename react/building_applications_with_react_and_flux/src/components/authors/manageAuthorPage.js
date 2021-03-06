"use strict";

var React = require('react');
var Router = require('react-router');
var AuthorForm = require('./authorForm');
var AuthorActions = require('../../actions/authorActions');
var AuthorStore = require('../../stores/authorStore');
var toastr = require('toastr');

var ManageAuthorPage = React.createClass({
  mixins: [
    Router.Navigation
  ],

  statics: {
    willTransitionFrom: function(transition, component) {
      // Checks if the components have been altered
      // Cannot use `this`, so use `component`
      if (component.state.dirty && !confirm('Leave without saving?')) {
        transition.abort();
      }
    }
  },

  getInitialState: function() {
    return {
      author: { id: '', firstName: '', lastName: '' },
      errors: {},
      dirty: false
    };
  },

  // This is the best place for hydrating a form
  componentWillMount: function() {
    var authorId = this.props.params.id;

    if (authorId) {
      this.setState({ author: AuthorStore.getAuthorById(authorId) });
    }
  },

  setAuthorState: function(event) {
    this.setState({ dirty: true });

    var field = event.target.name;
    var value = event.target.value;
    this.state.author[field] = value;
    return this.setState({ author: this.state.author });
  },

  authorFormIsValid: function() {
    var formIsValid = true;
    this.state.errors = {}; // clears any errors

    if (this.state.author.firstName.length < 3) {
      this.state.errors.firstName = 'First name must be at least three characters.';
      formIsValid = false;
    }

    if (this.state.author.lastName.length < 3) {
      this.state.errors.lastName = 'Last name must be at least three characters.';
      formIsValid = false;
    }

    this.setState({ errors: this.state.errors });
    return formIsValid
  },

  saveAuthor: function(event) {
    event.preventDefault();

    if (!this.authorFormIsValid()) {
      return;
    }

    if (this.state.author.id) {
      AuthorActions.updateAuthor(this.state.author);
    } else {
      AuthorActions.createAuthor(this.state.author);
    }

    this.setState({ dirty: false }); // Form is clean again
    toastr.success('Author saved.');
    // This is from the Router.Navigation mixin
    this.transitionTo('authors');
  },

  render: function() {
    return (
      <AuthorForm 
        author={this.state.author}
        onChange={this.setAuthorState}
        onSave={this.saveAuthor}
        errors={this.state.errors} />
    );
  }
});

module.exports = ManageAuthorPage;
