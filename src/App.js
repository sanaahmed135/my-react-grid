import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ReactDataGrid from 'react-data-grid'
import '../node_modules/bootstrap/dist/css/bootstrap.css'



class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.createRows();
    this._columns = [
      {
        key: 'id',
        name: 'ID'
      },
      {
        key: 'title',
        name: 'Title'
      },
      {
        key: 'priority',
        name: 'Priority',
        resizable:true,
        editable: true
      },
      {
        key: 'issueType',
        name: 'Issue Type',
        resizable:true
      },
      {
        key: 'complete',
        name: '% Complete',
        resizable:true
      },
      {
        key: 'startDate',
        name: 'Start Date',
        resizable:true
      },
      {
        key: 'completeDate',
        name: 'Expected Complete',
        resizable:true
      }
     ];

    this.state = null;
  }

  getRandomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleDateString();
  };

    createRows = () => {
      let rows = [];
      for (let i = 1; i < 1000; i++) {
        rows.push({
          id: i,
          title: 'Title ' + i,
          complete: Math.min(100, Math.round(Math.random() * 110)),
          priority: ['Critical', 'High', 'Medium', 'Low'][Math.floor((Math.random() * 3) + 1)],
          issueType: ['Bug', 'Improvement', 'Epic', 'Story'][Math.floor((Math.random() * 3) + 1)],
          startDate: this.getRandomDate(new Date(2015, 3, 1), new Date()),
          completeDate: this.getRandomDate(new Date(), new Date(2016, 0, 1))

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
