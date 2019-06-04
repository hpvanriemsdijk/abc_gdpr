import React from 'react'
import { Query } from 'react-apollo'
import { Card, Row, Col, Empty, Tag, Tooltip, Icon } from 'antd';
import { GET_OU, OU_BRANCH } from '../../queries/OUQueries';
import { ObjectModifiedDate, InfoLink } from '../generic/viewHelpers'
import { orderBranch } from '../generic/treeHelpers'
import ProcessesTable from '../processes/ListProcesses'
import ProcessingActiviesTable from '../processingActivities/ListProcessingActivities'
import UpdateOU from './UpdateOU'
import { OURACICard } from '../businessRoles/ViewBusinessRole'


export class OUInfoCard extends React.Component {
  extraOptions = (simplefied, obj) => {
    if(!simplefied) return <UpdateOU organizationalUnit={obj} />
  }

  objectModifiedDate = (simplefied, obj) => {
    if(!simplefied) return (
      <Row type="flex" justify="end">
        <Col style={{ textAlign:'right' }}><ObjectModifiedDate>{obj}</ObjectModifiedDate></Col>
      </Row>
    )
  }

  reportingUnit = (reportingUnit) => {
    if(reportingUnit) return "Yes"
    return "No"
  }

  render () {     
    let simplefied = this.props.simplefied || false

    return (      
      <Query
        query = { GET_OU }
        variables= {{ id: this.props.id }}
        >
        {({ loading, data, error }) => {
          if(error) return <Card><Empty>Oeps, error..</Empty></Card>
          const OrganizationalUnit = data.OrganizationalUnit || [];
          const OrganizationalUnitType = OrganizationalUnit.organizationalUnitType || [];

          return(
            <Card 
              loading = {loading}
              title={ OrganizationalUnit.name } 
              extra={ this.extraOptions(simplefied, OrganizationalUnit) }
              >
              <Row>
                <Col span={8}><strong>Description</strong></Col>
                <Col span={16}>{OrganizationalUnit.description}</Col>
              </Row>
              <Row>
                <Col span={8}><strong>Organizational unit type</strong></Col>
                <Col span={16}>
                  {OrganizationalUnitType.name} &nbsp;
                  <Tooltip title={OrganizationalUnitType.description} >
                    <Icon type="question-circle" theme="twoTone" />
                  </Tooltip>
                </Col>
              </Row>   
              <Row>
                <Col span={8}><strong>Reproting unit</strong></Col>
                <Col span={16}>{this.reportingUnit(OrganizationalUnitType.reportingUnit)}</Col>
              </Row>             
              {this.objectModifiedDate(simplefied, OrganizationalUnit)}
            </Card>  
          )
        }}
      </Query>
    )  
  }
}    

class OUBranchCard extends React.Component {
  Leaf = leaf =>{
    if(leaf.children.current){
      return <Tag color="blue">{leaf.children.name}</Tag>
    }else{
      return <InfoLink target={{label: leaf.children.name, linkPath: "/units", id: leaf.children.id, Component: OUInfoCard}}/>
    }
  }

  renderBranch = node => {
    if (node.child) {
      return (
        <li key={node.id}>
          <this.Leaf>{node}</this.Leaf>
          <ul>
          {node.child.map((d, key) => {
            return this.renderBranch(d)
          })}  
          </ul>
        </li>          
      );
    } else if (node.name) {
      return (
        <li key={node.id}><this.Leaf>{node}</this.Leaf></li>
      );
    }
    return null;
  };

  render () { 
    let {query, id} = this.props;

    return(
      <Query
        query = { query }
        variables= {{ id: id }}
        >
        {({ loading, data, error }) => {
          if(error) return <Card><Empty>Oeps, error..</Empty></Card>

          const dataSource = data.OrganizationalUnit || [];
          const orderedBranch = orderBranch(dataSource)
          
          return(
            <Card 
              loading = {loading}
              title= "Organization Hierarchy"
              >
            <div className="clt">
              <ul>
                {this.renderBranch(orderedBranch)}
              </ul>
            </div>
            </Card>
          ) 
        }}
      </Query>
    )
  }
}

export class viewOU extends React.Component {  
  state = {
    tabkey: 'process',
  }

  render () {   
    const tabListNoTitle = [{
      key: 'process',
      tab: 'Processes',
    },{
      key: 'processingActivies',
      tab: 'Processing Activies',
    }];
    
    const tabbedContent = {
      process: <ProcessesTable organizationalUnitId = { this.props.match.params.ouId } />,
      processingActivies: <ProcessingActiviesTable organizationalUnitId = { this.props.match.params.ouId } />
    };

    return (
      <div>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8} >
            <OUInfoCard id={this.props.match.params.ouId}/>
          </Col>
          <Col span={8}>
            <OURACICard id={this.props.match.params.ouId}/>
          </Col>
          <Col span={8}>
            <OUBranchCard query={OU_BRANCH} id={this.props.match.params.ouId} />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Card
              style={{ width: '100%' }}
              tabList={tabListNoTitle}
              activeTabKey={this.state.tabkey}
              onTabChange={(key) => { this.setState( { tabkey: key }); }}
              >
              {tabbedContent[this.state.tabkey]}
            </Card>
          </Col>
        </Row>                
      </div> 
    )
  }
}

export default viewOU