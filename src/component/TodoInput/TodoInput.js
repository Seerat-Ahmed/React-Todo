import React, { Component } from 'react';
import './todo-input.css';
import { connect } from 'react-redux';
import { _addTodoItem, _deleteAll } from '../../store/action/todo-item-action';
import { firebase } from '@firebase/app';


class TodoInput extends Component {

    constructor(props) {
        super(props);

        this.state = {
            todo: '',
        }

        this.handleAddButton = this.handleAddButton.bind(this);
        this.handleDeleteButton = this.handleDeleteButton.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addOnEnter = this.addOnEnter.bind(this);
    }

    componentDidMount() {
        this.textbox.focus();
    }

    handleAddButton() {
        if (this.state.todo !== '') {
            const todo = this.state.todo;
            firebase.database().ref('/todos/' + this.props.user.uid).push({ todo: todo });
            this.textbox.value = '';
            this.textbox.focus();
            this.setState({ todo: '' });
        }
    }

    handleDeleteButton() {
        firebase.database().ref('/todos/' + this.props.user.uid).remove()
            .then((success) => {
                this.props.deleteTodos();
            })
            .catch((error) => {
                console.log(error);
            })
    }

    handleChange(event) {
        this.setState({
            todo: event.target.value,
        });
    }

    addOnEnter(event) {
        if (event.key === 'Enter')
            this.handleAddButton();
    }

    render() {
        return (
            <div className="todo-input">
                <h2>Todoist</h2>
                <div className="form-group textbox">
                    <input type="text" name="todo-text" onKeyPress={this.addOnEnter} onChange={this.handleChange} className="form-control" ref={(el) => this.textbox = el} />
                </div>
                <button onClick={this.handleAddButton} className="btn btn-primary">Add Todo</button>
                <button onClick={this.handleDeleteButton} className="btn btn-danger">Delete All</button>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        deleteTodos: () => dispatch(_deleteAll()),
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoInput);