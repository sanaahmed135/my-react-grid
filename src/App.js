import React, { Component } from 'react';
import './App.css';
import ReactDataGrid,{Row} from 'react-data-grid'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import { Editors, Formatters,Toolbar} from 'react-data-grid-addons'
import update from 'immutability-helper';
import PropTypes from 'prop-types';

// //row reordering
// const {
//   Draggable: { Container: DraggableContainer, RowActionsCell, DropTargetRowContainer }
// } = require('react-data-grid-addons');

// const RowRendererReordering = DropTargetRowContainer(ReactDataGrid.Row);
const { Filters: { NumericFilter, AutoCompleteFilter, MultiSelectFilter, SingleSelectFilter }, Data: { Selectors } } = require('react-data-grid-addons');
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

//to render alternate rows into different colors
class RowRenderer extends React.Component {
  static propTypes = {
    idx: PropTypes.string.isRequired
  };

//   setScrollLeft = (scrollBy) => {
//     // if you want freeze columns to work, you need to make sure you implement this as apass through
//     this.row.setScrollLeft(scrollBy);
//   };

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
    this._columns = [
      {
        key: 'id',
        name: 'ID',
        width: 120,
        filterable: true,
        filterRenderer: NumericFilter
      },
      {
        key: 'task',
        name: 'Title',
        filterable: true,
        sortable: true,
        editable: true
      },
      {
        key: 'priority',
        name: 'Priority',
        filterable: true,
        filterRenderer: MultiSelectFilter,
        editor:PrioritiesEditor,
        sortable: true,
        editable: true
      },
      {
        key: 'issueType',
        name: 'Issue Type',
        filterable: true,
        filterRenderer: SingleSelectFilter,
        sortable: true,
        editable: true,
        editor: IssueTypesEditor
      },
      {
        key: 'developer',
        name: 'Developer',
        filterable: true,
        filterRenderer: AutoCompleteFilter,
        sortable: true,
        editable: true
      },
      {
        key: 'complete',
        name: '% Complete',
        filterable: true,
        filterRenderer: NumericFilter,
        sortable: true,
        editable: true,
        formatter: PercentCompleteFormatter
      },
      {
        key: 'startDate',
        name: 'Start Date',
        filterable: true,
        sortable: true,
        editable: true
      },
      {
        key: 'completeDate',
        name: 'Expected Complete',
        filterable: true,
        sortable: true,
        editable: true
      }
    ];

    this.state = { rows: this.createRows(1000).slice(0), filters: {}, originalRows : this.createRows(1000) ,selectedIndexes: [], selectedIds: [1, 2],selectedRows: []};
  }

  getRandomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleDateString();
  };

  createRows = (numberOfRows) => {
    let rows = [];
    for (let i = 1; i < numberOfRows; i++) {
      rows.push({
        id: i,
        task: 'Task ' + i,
        complete: Math.min(100, Math.round(Math.random() * 110)),
        priority: ['Critical', 'High', 'Medium', 'Low'][Math.floor((Math.random() * 3) + 1)],
        issueType: ['Bug', 'Improvement', 'Epic', 'Story'][Math.floor((Math.random() * 3) + 1)],
        developer: ['James', 'Tim', 'Daniel', 'Alan'][Math.floor((Math.random() * 3) + 1)],
        startDate: this.getRandomDate(new Date(2015, 3, 1), new Date()),
        completeDate: this.getRandomDate(new Date(), new Date(2016, 0, 1))
      });
    }
    return rows;
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

  rowGetter = (index) => {
    return Selectors.getRows(this.state)[index];
  };

  rowsCount = () => {
    return Selectors.getRows(this.state).length;
  };

  // //row reordering
  // isDraggedRowSelected = (selectedRows, rowDragSource) => {
  //   if (selectedRows && selectedRows.length > 0) {
  //     let key = this.props.rowIdx;
  //     return selectedRows.filter(r => r[key] === rowDragSource.data[key]).length > 0;
  //   }
  //   return false;
  // };

  // //row reordering
  // reorderRows = (e) => {
  //   let selectedRows = Selectors.getSelectedRowsByKey({rowIdx: this.props.rowIdx, selectedKeys: this.state.selectedIds, rows: this.state.rows});
  //   let draggedRows = this.isDraggedRowSelected(selectedRows, e.rowSource) ? selectedRows : [e.rowSource.data];
  //   let undraggedRows = this.state.rows.filter(function(r) {
  //     return draggedRows.indexOf(r) === -1;
  //   });
  //   let args = [e.rowTarget.idx, 0].concat(draggedRows);
  //   Array.prototype.splice.apply(undraggedRows, args);
  //   this.setState({rows: undraggedRows});
  // };

  //to select row
  onRowsSelected = (rows) => {
    this.setState({selectedIndexes: this.state.selectedIndexes.concat(rows.map(r => r.rowIdx))});
  };
  //to deselect a row
  onRowsDeselected = (rows) => {
    let rowIndexes = rows.map(r => r.rowIdx);
    this.setState({selectedIndexes: this.state.selectedIndexes.filter(i => rowIndexes.indexOf(i) === -1 )});
  };

  // //to display selected cell number
   onRowSelect = (rows) => {
    this.setState({ selectedRows: rows });
  };
  //to display selected cell number
  onCellSelected = ({ rowIdx, idx }) => {
    this.grid.openCellEditor(rowIdx, idx);
  };
  //to display selected cell number
  onCellDeSelected = ({ rowIdx, idx }) => {
    if (idx === 2) {
      alert('the editor for cell (' + rowIdx + ',' + idx + ') should have just closed');
    }
  };

  //cell-drag-down(with editable property in columns set to true)
  handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    let rows = this.state.rows.slice();

    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i];
      let updatedRow = update(rowToUpdate, {$merge: updated});
      rows[i] = updatedRow;
    }

    this.setState({ rows });
  };

  handleFilterChange = (filter) => {
    let newFilters = Object.assign({}, this.state.filters);
    if (filter.filterTerm) {
      newFilters[filter.column.key] = filter;
    } else {
      delete newFilters[filter.column.key];
    }
    this.setState({ filters: newFilters });
  };

  getValidFilterValues = (columnId) => {
    let values = this.state.rows.map(r => r[columnId]);
    return values.filter((item, i, a) => { return i === a.indexOf(item); });
  };

  handleOnClearFilters = () => {
    this.setState({ filters: {} });
  };

  render() {
    const rowText = this.state.selectedRows.length === 1 ? 'row' : 'rows';
    return  (
      <div>
      <span>{this.state.selectedRows.length} {rowText} selected</span>
      <ReactDataGrid
        ref={ node => this.grid = node }
        enableCellSelect={true}
        enableRowSelect="multi"
        onGridSort={this.handleGridSort}
        columns={this._columns}
        rowGetter={this.rowGetter}
        rowsCount={this.rowsCount()}
        minHeight={500}
        onRowSelect={this.onRowSelect}
        onCellSelected={this.onCellSelected}
        onCellDeSelected={this.onCellDeSelected}
        rowSelection={{
          showCheckbox: true,
          enableShiftSelect: true,
          onRowsSelected: this.onRowsSelected,
          onRowsDeselected: this.onRowsDeselected,
          selectBy: {
            indexes: this.state.selectedIndexes,
            keys: {rowIdx: this.props.rowIdx, values: this.state.selectedIds}
          }
        }}
        rowRenderer={RowRenderer} 
        toolbar={<Toolbar enableFilter={true}/>}
        onAddFilter={this.handleFilterChange}
        onGridRowsUpdated={this.handleGridRowsUpdated}
        getValidFilterValues={this.getValidFilterValues}
        onClearFilters={this.handleOnClearFilters} />
        </div>);
  }
}


export default App;
