import React from 'react'
import { withRouter } from 'react-router-dom'
import { Layout, Row } from 'antd';

class landingPage extends React.Component {
  render () {
    return (
      <Layout style={{height:"100vh", padding: 24}}>
        <Row type="flex" justify="center">
          This is the landing page.
        </Row>
      </Layout>
    )
  }
}

export default (withRouter(landingPage))