import React from 'react'
import { Query } from 'react-apollo'
import { Table, Divider, Card, Tag, Empty } from 'antd';
import { ALL_QUALITY_ATTRIBUTES } from '../../queries/QualityAttributeQueries';
import CreateQualityAttribute from './CreateQualityAttribute'
import UpdateQualityAttribute from './UpdateQualityAttribute' 
import DeleteQualityAttribute from './DeleteQualityAttribute'
import viewQualityAttributeDrawer from './ViewQualityAttribute'
import { clientSideFilter, filterHighlighter } from '../generic/tableHelpers'
import { ShowInDrawer } from '../generic/viewHelpers'

class QualityAttributeTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortedInfo: null, 
      filteredInfo: null
    };
  }

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  }

  handleSearch = (confirm) => {
    confirm();
  }

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ filteredInfo: null });
  }

  render () {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};

    const columns = [{
      title: 'Name',
      key: 'name',
      dataIndex: 'name',
      sorter: (a, b) => { return a.name.localeCompare(b.name)},
      sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
      ...clientSideFilter('name', this.searchInput, this.handleSearch, this.handleReset),
      ...filterHighlighter( 'name', filteredInfo )
    },{
      title: 'Labels',
      key: 'classificationLabels',
      dataIndex: 'classificationLabels',
      render: classificationLabels => (
        <span>
          { classificationLabels
            ? classificationLabels.map(c => <Tag key={c.score}>{c.score}: {c.label}</Tag>)
            : ""
          }
        </span>
      ),
    },{
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <span>
          <ShowInDrawer id={record.id} Component={viewQualityAttributeDrawer}>Details</ShowInDrawer>
          <Divider type="vertical" />
          <UpdateQualityAttribute qualityAttribute={record} />
          <Divider type="vertical" />
          <DeleteQualityAttribute qualityAttribute={record} />
        </span>
      ),
    }];
    
    return (
        <Query
          query = { ALL_QUALITY_ATTRIBUTES }
          >
          {({ loading, data, error }) => {
            if(error) return <Card><Empty>Oeps, error..</Empty></Card>
            const dataSource = data.allQualityAttributes || [];

            return(
              <React.Fragment>  
                <Card title="Quality Attributes" extra={<CreateQualityAttribute />} style={{ background: '#fff' }}>
                <Table 
                  loading={loading}
                  rowKey={record => record.id}
                  dataSource={dataSource}
                  columns={columns} 
                  onChange={this.handleChange} 
                  />
                </Card>
              </React.Fragment>  
            )}}
        </Query>
    )
  }
}

export default QualityAttributeTable