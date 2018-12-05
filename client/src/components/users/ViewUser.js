import React from 'react'
import { Row, Col, Card } from 'antd';
import { graphql } from 'react-apollo'
import { userQueries } from '../../queries/UserQueries';

function IsActive(props) {
  if (props.active) {
    return "Active";
  }
  return "Inactive";
}

class viewUser extends React.Component {
	render () {
    if (this.props.data.loading) {
      return (<div>Loading</div>)
    }

    if (this.props.data.error) {
      return (<div>An unexpected error occurred</div>)
    }

    return (
      <Card title={ "User details " + this.props.data.User.email } style={{ background: '#fff' }}>
        <Row>
          <Col span={4}>ID</Col>
          <Col span={18}> { this.props.data.User.id } </Col>
        </Row>
        <Row>
          <Col span={4}>Status</Col>
          <Col span={18}> <IsActive active={this.props.data.User.email} /> </Col>
        </Row>
        <Row>
          <Col span={4}>Email</Col>
          <Col span={18}>{ this.props.data.User.email} </Col>
        </Row>
      </Card>
    )
	}
}

const viewUserData = graphql(userQueries.view, {
  options: (ownProps) => ({
    variables: {
      userId: ownProps.userId 
    }
  })
})(viewUser)

export default viewUserData