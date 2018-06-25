import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ReactDataGrid from 'react-data-grid'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import { Editors, Formatters } from 'react-data-grid-addons'
import update from 'immutability-helper';


class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.createRows();
    this._columns = [
      {
        key: 'id',
        name: 'ID',       
        resizable:true
      },
      {
        key: 'title',
        name: 'Title',
        resizable:true
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
        resizable:true,
        editable: true
      },
      {
        key: 'complete',
        name: '% Complete',
        resizable:true,
        editable: true
      },
      {
        key: 'startDate',
        name: 'Start Date',
        resizable:true,
        editable: true
      },
      {
        key: 'completeDate',
        name: 'Expected ',
        resizable:true,
        editable: true
      }
     ];

     this.state = { rows: this.createRows(1000) };
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
  
      return rows;
    };
  
    rowGetter = (i) => {
      return this.state.rows[i];
    };
  
    handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
      let rows = this.state.rows.slice();
  
      for (let i = fromRow; i <= toRow; i++) {
        let rowToUpdate = rows[i];
        let updatedRow = update(rowToUpdate, {$merge: updated});
        rows[i] = updatedRow;
      }
  
      this.setState({ rows });
    };
  

  render() {
    return (
      <ReactDataGrid
      enableCellSelect={true}
      columns={this._columns}
      rowGetter={this.rowGetter}
      rowsCount={this.state.rows.length}
      minHeight={500}
      onGridRowsUpdated={this.handleGridRowsUpdated} />);
  }
}

export default App;
