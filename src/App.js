import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ReactDataGrid from 'react-data-grid'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import { Editors, Formatters} from 'react-data-grid-addons'
import update from 'immutability-helper';
import PropTypes from 'prop-types';

const { AutoComplete: AutoCompleteEditor, DropDownEditor } = Editors;
const { DropDownFormatter } = Formatters;

// options for priorities autocomplete editor
const priorities = [{ id: 0, title: 'Critical' }, { id: 1, title: 'High' }, { id: 2, title: 'Medium' }, { id: 3, title: 'Low'} ];
const PrioritiesEditor = <AutoCompleteEditor options={priorities} />;

// options for IssueType dropdown editor
// these can either be an array of strings, or an object that matches the schema below.
const issueTypes = [
  { id: 'bug', value: 'bug', text: 'Bug', title: 'Bug' },
  { id: 'improvement', value: 'improvement', text: 'Improvement', title: 'Improvement' },
  { id: 'epic', value: 'epic', text: 'Epic', title: 'Epic' },
  { id: 'story', value: 'story', text: 'Story', title: 'Story' }
];
const IssueTypesEditor = <DropDownEditor options={issueTypes}/>;

const IssueTypesFormatter = <DropDownFormatter options={issueTypes} value="bug"/>;

// Custom Formatter component
class PercentCompleteFormatter extends Component {
  static propTypes = {
    value: PropTypes.number.isRequired
  };
  render() {
    const percentComplete = this.props.value + '%';
    return (
      <div className="progress" style={{marginTop: '20px'}}>
        <div className="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{width: percentComplete}}>
          {percentComplete}
          
        </div>
      </div>);
  }
}
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
        editor: PrioritiesEditor,
        editable: true
      },
      {
        key: 'issueType',
        name: 'Issue Type',
        resizable:true,
        editor: IssueTypesEditor,
        editable: true
      },
      {
        key: 'complete',
        name: '% Complete',
        resizable:true,
        formatter: PercentCompleteFormatter
      },
      {
        key: 'startDate',
        name: 'Start Date',
        resizable:true,
        editable: true,
        sortable: true
      },
      {
        key: 'completeDate',
        name: 'Expected ',
        resizable:true,
        editable: true,
        sortable: true
      }
     ];
     let originalRows = this.createRows(1000);
     let rows = originalRows.slice(0);
     this.state = { rows: this.createRows(2000) };
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
  

    handleGridSort = (sortColumn, sortDirection) => {
      const comparer = (a, b) => {
        if (sortDirection === 'ASC') {
          return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
        } else if (sortDirection === 'DESC') {
          return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
        }
      };
  
      const rows = sortDirection === 'NONE' ? this.state.originalRows.slice(0) : this.state.rows.sort(comparer);
  
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
      onGridRowsUpdated={this.handleGridRowsUpdated}
      onGridSort={this.handleGridSort} />);
  }
}

export default App;
