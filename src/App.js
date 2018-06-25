import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ReactDom from 'react-dom'
import ReactDataGrid from 'react-data-grid'



class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.createRows();
    this._columns = [
      { key: 'id', name: 'ID',resizable: true },
      { key: 'title', name: 'Title',resizable: true },
      { key: 'count', name: 'Count',resizable: true } ];

    this.state = null;
  }

    createRows = () => {
      let rows = [];
      for (let i = 1; i < 1000; i++) {
        rows.push({
          id: i,
          title: 'Title ' + i,
          count: i * 1000
        });
      }
  
      this._rows = rows;
    };
  
    rowGetter = (i) => {
      return this._rows[i];
    };

  render() {
    return (
      <ReactDataGrid
        columns={this._columns}
        rowGetter={this.rowGetter}
        rowsCount={this._rows.length}
        
        minHeight={500} />);
  }
}

export default App;
