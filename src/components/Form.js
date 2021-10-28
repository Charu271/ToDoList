import React, { Component } from "react";
import "../App.css";
class Form extends Component {
  constructor(props) {
    super(props);
    this.change = this.change.bind(this);
    this.click = this.click.bind(this);
    this.selection = this.selection.bind(this);
    this.clear = this.clear.bind(this);
    this.state = {
      value: "",
      status: "",
      presenttodo: [],
    };
  }
  clear(e) {
    e.preventDefault();
    this.props.clearHandler();
  }
  change(event) {
    this.setState(
      {
        value: event.target.value,
      },
      () => {
        this.props.inputHandler(this.state.value);
      }
    );
  }

  click(event) {
    event.preventDefault();
    this.setState({ value: "" });
    this.props.buttonHandler();
  }
  selection(event) {
    this.props.stateHandler(event);
  }
  render() {
    return (
      <form id="form">
        <input
          type="text"
          value={this.state.value}
          onChange={this.change}
          id="input1"
        />
        <button onClick={this.click}>
          <i class="fa fa-plus" aria-hidden="true"></i>
        </button>
        <select onChange={this.selection} value={this.props.status}>
          <option value="All">All</option>
          <option value="Completed">Completed</option>
          <option value="Uncompleted">Uncompleted</option>
        </select>
        <button id="refresh" onClick={this.clear}>
          <i class="fa fa-refresh" aria-hidden="true"></i>
        </button>
      </form>
    );
  }
}
export default Form;
