import React from 'react'
import { Input, Button, Icon } from 'antd'
import Highlighter from "react-highlight-words"

const clientSideFilter = (dataIndex, searchInput, handleSearch, handleReset) => ({
    filterDropdown: ({
      setSelectedKeys, selectedKeys, confirm, clearFilters,
    }) => {
      return(
      <div className="search-filter-dropdown">
        <div style={{ padding:8 }}>
          <Input
            ref={node => { searchInput = node; }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(confirm)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
        </div>
        <div className="search-filter-dropdown-btns" >
          <Button
            type="primary"
            onClick={() => handleSearch(confirm)}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          </div>
      </div>
    )},
    filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select());
      }
    }
  })

  const filterHighlighter = (dataIndex, searchInput) => ({
    render: (text) => {
      let searchText = searchInput[dataIndex] || [null]

      return(
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffffb8', padding: 0 }}
          searchWords={[searchText[0]]}
          autoEscape
          textToHighlight={text.toString()}
        />
      )
    },
  })



  
export { clientSideFilter, filterHighlighter };