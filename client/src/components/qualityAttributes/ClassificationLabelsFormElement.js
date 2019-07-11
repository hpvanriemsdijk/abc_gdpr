import React from 'react'
import { Form, Input, Button, Icon, Table,  } from 'antd';
import { DragSource, DropTarget, DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const EditableContext = React.createContext();
let dragingIndex = -1;

class BodyRow extends React.Component {
  render() {
    const { form, props, isOver, connectDragSource, connectDropTarget, moveRow, ...restProps } = this.props;
    const style = { ...restProps.style, cursor: 'move' };

    let className = restProps.className;
    if (isOver) {
      if (restProps.index > dragingIndex) {
        className += ' drop-over-downward';
      }
      if (restProps.index < dragingIndex) {
        className += ' drop-over-upward';
      }
    }

    return(
      <EditableContext.Provider value={form}>
        {connectDragSource(
          connectDropTarget(<tr {...restProps} className={className} style={style} />),
        )}
      </EditableContext.Provider>
    ) 
  }
}

const rowSource = {
  beginDrag(props) {
    dragingIndex = props.index;
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    if (dragIndex === hoverIndex) {return;}
    props.moveRow(dragIndex, hoverIndex);
    monitor.getItem().index = hoverIndex;
  },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(
  DragSource('row', rowSource, connect => ({
    connectDragSource: connect.dragSource(),
  }))(Form.create()(BodyRow)),
);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0,}}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input className="inlineEdit" ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ marginTop: 5, marginBottom: 5, paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

class ClassificationLabels extends React.Component {
  handleDelete = score => {
    const { dataSource, passLabels } = this.props;
    passLabels(
      this.reorderKeys(dataSource.filter(item => item.score !== score))
    );
  };

  handleAdd = () => {
    const { dataSource, passLabels } = this.props;
    const count  = dataSource.length;

    const newData = {
      score: count,
      label: `Label ${count}`,
      criteria: `This classification is applied when ${count}`,
    };
    passLabels(
      this.reorderKeys([...dataSource, newData])
    );
  };

  handleSave = row => {
    const { passLabels } = this.props;
    const newData = [...this.props.dataSource];
    const index = newData.findIndex(item => row.score === item.score);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    passLabels(
      this.reorderKeys(newData)
    );
  };

  reorderKeys = dataSource => {
    let newData = [];

    dataSource.forEach(function (item, index) {
      newData.push(item);
      newData[index]['score'] = index;
    });
    
    return newData
  }

  moveRow = (dragIndex, hoverIndex) => {
    const { dataSource, passLabels } = this.props;
    const dragRow = dataSource[dragIndex];

    dataSource.splice(dragIndex, 1);
    dataSource.splice(hoverIndex, 0, dragRow);
    passLabels(
      this.reorderKeys(dataSource)
    );
  };

  render() {
    const { dataSource } = this.props;
      
    const components = {
      body: {
        row: DragableBodyRow,
        cell: EditableCell,
      },
    };

    const columnList = [{
        title: 'Score',
        dataIndex: 'score',
        width: '5%'
      },{
        title: 'Label',
        dataIndex: 'label',
        width: '20%',
        editable: true,
      },{
        title: 'Criteria',
        dataIndex: 'criteria',
        editable: true,
      },{
        dataIndex: 'operation',
        render: (text, record) =>
          <Button type="link" onClick={() => this.handleDelete(record.score)} >Delete</Button>
      },
    ];
    
    const columns = columnList.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });

    return (
      <>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          pagination={false}
          dataSource={dataSource}
          columns={columns}
          rowKey="score"
          onRow={(record, index) => ({
            index,
            moveRow: this.moveRow,
          })}
        />
        <div>
        <Button type="dashed" onClick={this.handleAdd} style={{ width: '100%', marginTop: 20 }}>
          <Icon type="plus" /> Add label
        </Button>
        </div>
      </>
    );
  }
}

export default DragDropContext(HTML5Backend)(ClassificationLabels);