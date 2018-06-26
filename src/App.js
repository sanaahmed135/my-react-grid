import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ReactDataGrid,{Row} from 'react-data-grid'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import { Editors, Formatters,Selectors} from 'react-data-grid-addons'
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

class RowRenderer extends React.Component {
  static propTypes = {
    idx: PropTypes.string.isRequired
  };

  setScrollLeft = (scrollBy) => {
    // if you want freeze columns to work, you need to make sure you implement this as apass through
    this.row.setScrollLeft(scrollBy);
  };

  getRowStyle = () => {
    return {
      color: this.getRowBackground()
    };
  };

  getRowBackground = () => {
    return this.props.idx % 2 ?  'green' : 'blue';
  };

  render() {
    // here we are just changing the style
    // but we could replace this with anything we liked, cards, images, etc
    // usually though it will just be a matter of wrapping a div, and then calling back through to the grid
    return (<div style={this.getRowStyle()}><Row ref={ node => this.row = node } {...this.props}/></div>);
  }
}

class App extends Component {
  constructor(props, context) {
    super(props, context);
    // this.createRows();
    this._columns = [
      {
        key: 'id',
        name: 'ID',       
        locked:true
      },
      {
        key: 'title',
        name: 'Title',
        editable: true,
        resizable:true,
        filterable: true,
        sortable: true
      },
      {
        key: 'priority',
        name: 'Priority',
        resizable:true,
        editor: PrioritiesEditor,
        editable: true,
        filterable: true,
        sortable: true
      },
      {
        key: 'issueType',
        name: 'Issue Type',
        resizable:true,
        editor: IssueTypesEditor,
        editable: true,
        filterable: true,
        sortable: true
      },
      {
        key: 'complete',
        name: '% Complete',
        resizable:true,
        editable: true,
        formatter: PercentCompleteFormatter,
        filterable: true,
        sortable: true
      },
      {
        key: 'startDate',
        name: 'Start Date',
        resizable:true,
        editable: true,
        filterable: true,
        sortable: true
      },
      {
        key: 'completeDate',
        name: 'Expected ',
        resizable:true,
        editable: true,
        filterable: true,
        sortable: true
      }
     ];
      let originalRows = this.createRows(1000);
      let rows = originalRows.slice(0);
     this.state = { rows: this.createRows(1000) , filters: {}, sortColumn: null, sortDirection: null, selectedIndexes: []  };
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
    
    getRows = () => {
      return Selectors.getRows(this.state);
    };
  
    getSize = () => {
      return this.getRows().length;
    };

    rowGetter = (i) => {
      return this.state.rows[i];
    };

    onRowsSelected = (rows) => {
      this.setState({selectedIndexes: this.state.selectedIndexes.concat(rows.map(r => r.rowIdx))});
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

    // onRowClick = (rowIdx, row) => {
    //   let rows = this.state.rows.slice();
    //   rows[rowIdx] = Object.assign({}, row, {isSelected: !row.isSelected});
    //   this.setState({ rows });
    // };
  
    // onKeyDown = (e) => {
    //   if (e.ctrlKey && e.keyCode === 65) {
    //     e.preventDefault();
  
    //     let rows = [];
    //     this.state.rows.forEach((r) =>{
    //       rows.push(Object.assign({}, r, {isSelected: true}));
    //     });
  
    //     this.setState({ rows });
    //   }
    // };

    onRowsSelected = (rows) => {
      this.setState({selectedIndexes: this.state.selectedIndexes.concat(rows.map(r => r.rowIdx))});
    };
  
    onRowsDeselected = (rows) => {
      let rowIndexes = rows.map(r => r.rowIdx);
      this.setState({selectedIndexes: this.state.selectedIndexes.filter(i => rowIndexes.indexOf(i) === -1 )});
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
      onGridSort={this.handleGridSort}
      rowRenderer={RowRenderer} 
      onRowClick={this.onRowClick}
      onGridKeyDown={this.onKeyDown}
      rowSelection={{
        showCheckbox: true,
        enableShiftSelect: true,
        onRowsSelected: this.onRowsSelected,
        onRowsDeselected: this.onRowsDeselected,
        selectBy: {
          indexes: this.state.selectedIndexes
        }
      }}  />);

  }
}

export default App;
