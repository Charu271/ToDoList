import React from "react";
import "./App.css";
import Form from "./components/Form.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: -1,
      checkvar: -1,
      id: 0,
      clicked: false,
      value: "",
      items: [],
      prevId: -1,
      prevState: "All",
      status: "",
      checkeditems: [],
      selected: [],
      currentItem: {
        task: "",
      },
    };
  }
  selectionHandler = () => {
    switch (this.state.status) {
      case "Completed":
        this.setState(
          {
            selected: this.state.items.filter((item) => {
              return item.checked === true;
            }),
          },
          () => {
            localStorage.setItem(
              "selected",
              JSON.stringify(
                this.state.items.filter((item) => {
                  return item.checked === true;
                })
              )
            );
          }
        );
        break;
      case "Uncompleted":
        this.setState(
          {
            selected: this.state.items.filter((item) => {
              return item.checked == false;
            }),
          },
          () => {
            localStorage.setItem(
              "selected",
              JSON.stringify(
                this.state.items.filter((item) => {
                  return item.checked === false;
                })
              )
            );
          }
        );
        break;
      default:
        this.setState({ selected: this.state.items }, () => {
          localStorage.setItem("selected", JSON.stringify(this.state.items));
        });
    }

    console.log(this.state.selected);
  };
  stateHandler = (event) => {
    this.setState({ status: event.target.value });
    console.log(event.target.status);
  };
  inputHandler = (e) => {
    this.setState({ clicked: false });
    this.setState({ value: e });
  };
  buttonHandler = () => {
    this.setState({
      items: [
        ...this.state.items,
        { name: this.state.value, id: this.state.id, checked: false },
      ],
    });
    this.setState({
      selected: [
        ...this.state.selected,
        { name: this.state.value, id: this.state.id, checked: false },
      ],
    });
    this.setState({ id: this.state.id + 1 });
    this.setState({ checkeditems: [...this.state.checkeditems, false] });
  };
  deletion = (event, todelete, index, th) => {
    const neitems = this.state.selected.filter((item) => {
      return item.id !== todelete.id;
    });
    this.setState({ selected: neitems });

    const newitems = this.state.items.filter((item) => {
      return item.id !== todelete.id;
    });
    this.setState({ items: newitems }, () => {
      this.saveToDos();
    });
  };
  saveToDos() {
    console.log(this.state.items);
    localStorage.setItem("items", JSON.stringify(this.state.items));
    localStorage.setItem("selected", JSON.stringify(this.state.selected));
    localStorage.setItem("status", JSON.stringify(this.state.status));
  }
  uncheck = (item, itempassed) => {
    if (item === itempassed)
      return {
        ...item,
        checked: false,
      };
    return item;
  };
  check = (item, itempassed) => {
    if (item === itempassed)
      return {
        ...item,
        checked: true,
      };
    return item;
  };
  filter = () => {
    if (this.state.status === "Completed") {
      this.setState({
        selected: this.state.items.filter((item) => {
          return item.checked === true;
        }),
      });
      localStorage.setItem(
        "selected",
        JSON.stringify(
          this.state.items.filter((item) => {
            return item.checked === true;
          })
        )
      );
    } else if (this.state.status === "Uncompleted") {
      this.setState({
        selected: this.state.items.filter((item) => {
          return item.checked === false;
        }),
      });
      localStorage.setItem(
        "selected",
        JSON.stringify(
          this.state.items.filter((item) => {
            return item.checked === false;
          })
        )
      );
    } else {
      this.setState({ selected: this.state.items });
      localStorage.setItem("selected", JSON.stringify(this.state.items));
    }
  };
  checked = (event, ind, itempassed) => {
    if (itempassed.checked) {
      this.setState(
        {
          items: this.state.items.map((item) => this.uncheck(item, itempassed)),
          selected: this.state.selected.map((item) =>
            this.uncheck(item, itempassed)
          ),
        },
        () => {
          localStorage.setItem("items", JSON.stringify(this.state.items));
          setTimeout(() => {
            this.filter();
          }, 500);
        }
      );
    } else {
      this.setState(
        {
          items: this.state.items.map((item) => this.check(item, itempassed)),
          selected: this.state.selected.map((item) =>
            this.check(item, itempassed)
          ),
        },
        () => {
          setTimeout(() => {
            this.filter();
          }, 500);
        }
      );
    }
  };

  getlocalToDo = () => {
    if (localStorage.getItem("items") === null) {
      localStorage.setItem("items", JSON.stringify([]));
      localStorage.setItem("selected", JSON.stringify([]));
    } else {
      const lc1 = JSON.parse(localStorage.getItem("items"));
      const lc2 = JSON.parse(localStorage.getItem("selected"));
      const s = JSON.parse(localStorage.getItem("status"));
      this.setState({ items: lc1 });
      this.setState({ selected: lc2 });
      this.setState({ status: s });
      this.saveToDos(lc1, lc2);
    }
  };
  clearHandler = () => {
    this.setState({ items: [] });
    this.setState({ selected: [] });
    localStorage.setItem("items", JSON.stringify([]));
    localStorage.setItem("selected", JSON.stringify([]));
    localStorage.setItem("status", "All");
    console.log(this.state.items);
  };
  componentDidMount() {
    this.getlocalToDo();
  }
  componentDidUpdate() {
    if (this.state.status !== this.state.prevState) {
      this.setState({ prevState: this.state.status });
      this.selectionHandler();
      this.saveToDos();
    }
    if (this.state.prevId !== this.state.id) {
      this.setState({ prevId: this.state.prevId + 1 });
      this.saveToDos();
    }
  }
  render() {
    return (
      <div className="App">
        <h1 id="clip">To Do List</h1>
        <Form
          id="form"
          status={this.state.status}
          clearHandler={this.clearHandler}
          stateHandler={this.stateHandler}
          items={this.state.items}
          inputHandler={this.inputHandler}
          buttonHandler={this.buttonHandler}
        ></Form>
        <ul>
          {this.state.selected.map((item, index) => {
            if (item.name !== "") {
              return (
                <div id="div">
                  <span>
                    <li className={`${item.checked ? "checked" : ""}`}>
                      {item.name}
                      <span>
                        <i
                          className="fa fa-trash-o"
                          aria-hidden="true"
                          onClick={(e) => this.deletion(e, item, index)}
                        ></i>
                        <i
                          className={`${
                            item.checked
                              ? "fa fa-check-square"
                              : "fa fa-square-o"
                          }`}
                          onClick={(e) => this.checked(e, index, item, this)}
                          aria-hidden="true"
                        ></i>
                      </span>
                    </li>
                  </span>
                </div>
              );
            } else return null;
          })}
        </ul>
      </div>
    );
  }
}

export default App;
