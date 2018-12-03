import React from 'react'
import { Layout, Row } from 'antd';
import { Link } from 'react-router-dom'

class error_404 extends React.Component {
  render () {
    return (
      <Layout style={{height:"100vh", padding: 24}}>
        <Row type="flex" justify="center">
          Page not found, go back&nbsp;<Link to="/">home</Link>
        </Row>
      </Layout>
    )
  }
}

export default (error_404)