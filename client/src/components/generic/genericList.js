import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';import { Table, Divider, Card } from 'antd';
import { clientSideFilter, filterHighlighter } from '../generic/tableHelpers'
import { Error } from '../generic/viewHelpers'

/*
 *  Component for showing a list for simple (id, name, description) models 
 *  Profide:
 *  - typeName (Camelcase, fist case lower)
 *  - typeLabel
 *  - allQuery
 *  - ViewComponent (Ignored when empty)
 *  - UpsertComponent (Ignored when empty)
 *  - DeleteComponent (Ignored when empty)
 */
function GenericList(props) {
    const [sortedInfo, setSortedInfo] = useState({});
    const [filteredInfo, setFilteredInfo] = useState({});
    const { typeName, typeLabel, allQuery, ViewComponent, UpsertComponent, DeleteComponent } = props;
    const { data, loading, error } = useQuery( allQuery );

    if(error) return <Error />

    const handleChange = (pagination, filters, sorter) => {
        setSortedInfo(sorter);
        setFilteredInfo(filters);
    }
    
    const handleSearch = (confirm) => {
        confirm();
    }
    
    const handleReset = (clearFilters) => {
        clearFilters();
        setSortedInfo({});
        setFilteredInfo({});
    }

    const searchInput = () => {}

    const viewComponent = (id) => {
        if(id){
            return <ViewComponent id={id} />
        }        
    }

    const editComponent = (id) => {
        if(id){
            return <UpsertComponent id={id} />
        }
    }

    const deleteComponent = (id) => {
        if(id){
            return <DeleteComponent id={id} />
        }
    }
    
    const columns = [{
        title: 'Name',
        key: 'name',
        dataIndex: 'name',
        sorter: (a, b) => { return a.name.localeCompare(b.name)},
        sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
        ...clientSideFilter('name', searchInput, handleSearch, handleReset),
        ...filterHighlighter( 'name', filteredInfo )
    },{
        title: 'Description',
        key: 'description',
        dataIndex: 'description',
        ...clientSideFilter('description', searchInput, handleSearch, handleReset),
        ...filterHighlighter( 'description', filteredInfo, 200 )
    },{
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
            <span className="actions">
            { viewComponent(record.id) }
            <Divider type="vertical" />
            { editComponent(record.id) }
            <Divider type="vertical" />
            { deleteComponent(record.id) }
            </span>
        ),
    }];

    return(
        <Card 
            title={typeLabel}
            extra={<UpsertComponent />} style={{ background: '#fff' }}
            >
            <Table 
                loading={loading}
                rowKey={record => record.id}
                rowClassName={(record, index) => record.updatedAt < 0 ? 'optimisticColumn' : '' }
                dataSource={loading?[]:data[typeName]}
                columns={columns} 
                onChange={handleChange} 
                />
        </Card>
    )
}

export default GenericList