import React from 'react'
import { Layout, Row } from 'antd';

export class ApolloError extends React.Component {
  render () {
    return (
      <Layout style={{height:"100vh", padding: 24}}>
        <Row type="flex" justify="center">
          There have been a error connecting to the backend-server.
        </Row>
      </Layout>
    )
  }
}