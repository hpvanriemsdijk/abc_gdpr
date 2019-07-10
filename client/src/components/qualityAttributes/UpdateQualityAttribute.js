import React from 'react'
import { Mutation, Query } from 'react-apollo'
import { UPDATE_QUALITY_ATTRIBUTE, GET_QUALITY_ATTRIBUTE, qualityAttributeEnums } from '../../queries/QualityAttributeQueries';
import { Modal, Form, Input, Button, notification, Select, Icon, Table, Spin } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
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

class UpdateQualityAttributeModal extends React.Component {
  constructor() {
    super();

    this.state = {
      modalVisible: false,
      dataSource: null
    };
  }

  showModal = () => {
    this.setState({ modalVisible: true });
  };

  closeModal = () => {
    this.setState({ modalVisible: false });
  };

  // Modal
  onCreateQualityAttribute = createQualityAttribute => {
    const { form } = this.props;
   
    form.validateFields(async (err, values) => {
      if (!err) {
        let updateLabels = this.state.dataSource.map(updateLabel => {
          return {
            where: {id: updateLabel.id},
            data: {
              criteria: updateLabel.criteria,
              label: updateLabel.label,
              score: updateLabel.score,
            }
          }
        })

        await createQualityAttribute({ variables: {
          id: this.props.qualityAttribute.id,
          data: {
            name: values.name, 
            description: values.description,
            appliesToObject: values.appliesToObject,
            classificationLabels: {
              update: updateLabels
            } 
          }
        }}).catch( res => {
          notification['warning']({
            message: "Could not create QualityAttribute",
            description: res.message,
            duration: 5
          });
        });
        this.closeModal();
        form.resetFields();
      }
    });
  };

  passLabels = (lables) => {
    this.setState({ dataSource: lables });
  }
    
  sanitizeClassificationLabels = (classificationLabels) => {
    let sanitized = classificationLabels.map(classificationLabel => {
      return ({
        id: classificationLabel.id,
        score: classificationLabel.score,
        label: classificationLabel.label,
        criteria: classificationLabel.criteria,
      })
    })

    return sanitized
  }


  render() {
    const { form } = this.props;
    const { TextArea } = Input;

    return (
      <React.Fragment>
        <Query
          query = { GET_QUALITY_ATTRIBUTE }
          variables = {{ id: this.props.qualityAttribute.id }}
          skip = { !this.state.modalVisible }
          onCompleted = {data => this.setState({ dataSource: this.sanitizeClassificationLabels(data.qualityAttribute.classificationLabels) })}
          >
          {({ loading, data, error }) => {
            if( !this.state.modalVisible || error) return null
            const loadingData = loading;
            const QualityAttributeData = data.qualityAttribute || [];

            return(
              <Mutation 
                mutation={UPDATE_QUALITY_ATTRIBUTE}
                refetchQueries={["QualityAttributes", "QualityAttribute"]}
                >
                {(createQualityAttribute, { loading }) => {
                  return (
                    <Modal
                      onOk={e => this.onCreateQualityAttribute(createQualityAttribute)}
                      onCancel={this.closeModal}
                      width={800}
                      title="Update Quality attribute"
                      confirmLoading={loading}
                      visible={this.state.modalVisible}
                      >
                      <Spin tip="Loading..." spinning={loadingData}>
                        <Form layout="horizontal">
                          <Form.Item label="Name">
                            {form.getFieldDecorator('name', {
                              initialValue: QualityAttributeData.name,
                              rules: [
                                { required: true, message: 'Please enter a name!' }
                              ],
                            })(<Input />)}
                          </Form.Item>                            
                          <Form.Item 
                            label="Description">
                            {form.getFieldDecorator('description', {
                              initialValue: QualityAttributeData.description,
                              rules: [
                                { required: true, message: 'Please enter a description!' }
                              ],
                            })(<TextArea autosize={{ minRows: 2, maxRows: 4 }} />)}
                          </Form.Item>
                          <Form.Item label="Classification object">
                            {form.getFieldDecorator('appliesToObject', {
                              initialValue: QualityAttributeData.appliesToObject,
                              rules: [{ required: true, message: 'Select a object!' }]
                            })(
                              <Select
                                style={{ width: '100%' }}
                                allowClear={true}
                                placeholder="Select a object"
                              >
                                {qualityAttributeEnums.objects.map(object => <Select.Option key={object.value} value={object.value || undefined}>{object.label}</Select.Option>)}
                              </Select>
                              
                              )}              
                          </Form.Item>                  
                          <Form.Item label="Classification labels">
                            <ClassificationLabels dataSource={this.state.dataSource} passLabels={this.passLabels} />
                          </Form.Item>
                        </Form>
                      </Spin>
                    </Modal>
                  );
                }}
              </Mutation>
          )}}
        </Query>
        <Button onClick={this.showModal} type="link">
          Edit
        </Button>
      </React.Fragment>
    );
  }
}

export default Form.create()(DragDropContext(HTML5Backend)(UpdateQualityAttributeModal));