import React from 'react'
import { Query } from 'react-apollo'
import { Card, Row, Col, Empty, Tooltip, Icon, Avatar, Divider } from 'antd'
import { GET_BUSINESS_ROLE } from '../../queries/BusinessRoleQueries';
import UpdateBusinessRole from '../businessRoles/UpdateBusinessRole'
import DeleteBusinessRole from '../businessRoles/DeleteBusinessRole'
import CreateBusinessRole from '../businessRoles/CreateBusinessRole'
import { BUSINESS_ROLES_BY_OU } from '../../queries/BusinessRoleQueries';


class viewBusinessRole extends React.Component {
  render () {  
    return (
        <Query
          query = { GET_BUSINESS_ROLE }
          variables= {{ id: this.props.id || this.props.match.params.businessRoleId }}
          >
          {({ loading, data, error }) => {
            if(error) return <Card><Empty>Oeps, error..</Empty></Card>
            const dataSource = data.businessRole || [];

            return(
              <React.Fragment>  
                <Card 
                  loading={loading}
                  title={`BusinessRole: ${dataSource.name}`} 
                  style={{ background: '#fff' }}>
                  <div>{dataSource.description}</div>
                </Card>
              </React.Fragment>  
            )}}
        </Query>
    )
  }
}


export class OURACICard extends React.Component {
  raciLabel = (businessRole, raci) => {
    if(businessRole[raci]){
      return(
        <Tooltip title={ businessRole[raci] } >
          <Avatar>{businessRole[raci].charAt(0)}</Avatar>
        </Tooltip>
      )
    }else{
      return ' '
    }
  }

  name = (businessRole) => {
    if(businessRole.person){
      return <div><em>{businessRole.person.surname} {businessRole.person.name}</em></div>
    }else{
      return <div>-</div>
    }
  }

  hasParent = (businessRole) => {
    const organizationalUnitId = this.props.id || null;

    if(businessRole.organizationalUnit && businessRole.organizationalUnit.id !== organizationalUnitId){
      const tooltipTitle = "Inherited from " + businessRole.organizationalUnit.name
      return (
        <Tooltip title={tooltipTitle} >
          <Icon type="enter" rotate={90} style={{ paddingRight: 5 }} />
        </Tooltip>
       )
    }
  }
  
  render () { 
    const organizationalUnitId = this.props.id || null;

    return(
    <Query
      query = { BUSINESS_ROLES_BY_OU }
      variables= {{
        id: organizationalUnitId
      }}
      >
      {({ loading, data, error }) => {
        if(error) return <Card><Empty>Oeps, error..</Empty></Card>
        const businessRoles = data.businessRoleByOu || [];

        return(
          <Card 
            loading = {loading}
            title= "Responsibilities"
            extra={ <CreateBusinessRole organizationalUnit={organizationalUnitId} /> }
            >
            <Row>
              <Col span={8}></Col>
              <Col span={2} style={{textAlign:"center"}}>
                <Tooltip title="Executive" ><strong>Ex</strong></Tooltip>
              </Col>
              <Col span={2} style={{textAlign:"center"}}>
                <Tooltip title="Financial" ><strong>Fi</strong></Tooltip>
              </Col>
              <Col span={2} style={{textAlign:"center"}}>
                <Tooltip title="Security" ><strong>Se</strong></Tooltip>
              </Col>
              <Col span={2} style={{textAlign:"center"}}>
                <Tooltip title="Privacy" ><strong>Pr</strong></Tooltip>
              </Col>
              <Col span={4}></Col>
            </Row>
            {businessRoles.map((businessRole) => {  
              return(
                <Row key={businessRole.id} >
                  <Col span={8}>
                    <Tooltip title={businessRole.description} >
                      {this.hasParent(businessRole)}
                      <strong>{businessRole.name}</strong>
                    </Tooltip>
                    { this.name(businessRole) } 
                  </Col>
                  <Col span={2} style={{textAlign:"center"}}>{ this.raciLabel(businessRole, 'raciExecutive') }</Col>
                  <Col span={2} style={{textAlign:"center"}}>{ this.raciLabel(businessRole, 'raciFinancial') }</Col>
                  <Col span={2} style={{textAlign:"center"}}>{ this.raciLabel(businessRole, 'raciSecurity') }</Col>
                  <Col span={2} style={{textAlign:"center"}}>{ this.raciLabel(businessRole, 'raciPrivacy') }</Col>
                  <Col span={4} style={{float:"right"}}>
                    <UpdateBusinessRole businessRole={businessRole} />
                    <Divider type="vertical" />
                    <DeleteBusinessRole businessRole={businessRole} />
                  </Col>
                </Row>
              )     
            })}
          </Card>  
          )
        }}
      </Query>
    )
  }
}

export default viewBusinessRole