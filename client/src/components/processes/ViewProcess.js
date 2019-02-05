import React from 'react'
import { Query } from 'react-apollo'
import { Card, Row, Col, Empty, Icon } from 'antd';
import { GET_PROCESS, PROCESSES_BRANCH } from '../../queries/ProcessQueries';
import { OU_BRANCH } from '../../queries/OUQueries';
import ViewBusinessRole from '../businessRoles/ViewBusinessRole'
import { OUInfoCard } from '../organizationalUnits/ViewOU'
import UpdateProcess from './UpdateProcess'
import ProcessingActivityTable from '../processingActivities/ListProcessingActivities'
import { ObjectModifiedDate, InfoLink } from '../generic/viewHelpers'
import  '../generic/treeHelpers.css'
import { orderBranch, orderParents} from '../generic/treeHelpers'

class ProcesInfoCard extends React.Component {
  getProcessOwner = (obj) => {
    if(obj.processOwner){
      return <InfoLink target={{label: obj.processOwner.name, linkPath: "/businessRoles", id: obj.processOwner.id, Component: ViewBusinessRole}}/>
    } else {
      return "No owner assigned"
    }
  }

  renderBranch = (orderPath) => {
    let branch = [<InfoLink key={orderPath.id} target={{label: orderPath.name, linkPath: "/units", id: orderPath.id, Component: OUInfoCard}}/>]
    if(orderPath.child){
      branch.push(<span key={1}> <Icon type="arrow-right" /> <InfoLink key={orderPath.child.id} target={{label: orderPath.child.name, linkPath: "/units", id: orderPath.child.id, Component: OUInfoCard}}/></span>)
      if(orderPath.child.child){
        branch.push(<span key={2}> <Icon type="arrow-right" /> <InfoLink key={orderPath.child.child.id} target={{label: orderPath.child.child.name, linkPath: "/units", id: orderPath.child.child.id, Component: OUInfoCard}}/> </span>)
      }
    }

    return branch
  }

  getOu = (obj) => {
    if(obj.organizationalUnit){
      return(
        <Query
          query = { OU_BRANCH }
          variables= {{ id: obj.organizationalUnit.id }}
          >
          {({ loading, data, error }) => {
            if(error) return "No organizational unit assigned"
            if(loading) return "Loading organizational unit"
            const dataSource = data.OrganizationalUnit || [];
            const orderedParents = orderParents(dataSource)
            return this.renderBranch(orderedParents)
          }}
        </Query>
      )
    } else {
      return "No organizational unit assigned"
    }
  }

  extraOptions = (simplefied, obj) => {
    if(!simplefied) return <UpdateProcess process={obj} />
  }

  objectModifiedDate = (simplefied, obj) => {
    if(!simplefied) return (
      <Row type="flex" justify="end">
        <Col style={{ textAlign:'right' }}><ObjectModifiedDate>{obj}</ObjectModifiedDate></Col>
      </Row>
    )
  }

  render () {     
    let simplefied = this.props.simplefied || false

    return (
      <Query
        query = { GET_PROCESS }
        variables= {{ id: this.props.id }}
        >
        {({ loading, data, error }) => {
          if(error) return <Card><Empty>Oeps, error..</Empty></Card>
          const dataSource = data.Process || [];

          return(
            <Card 
              loading = {loading}
              title={ dataSource.name } 
              extra={ this.extraOptions(simplefied, dataSource) }
              >
              <Row>
                <Col span={8}><strong>Description</strong></Col>
                <Col span={16}>{dataSource.description}</Col>
              </Row>
              <Row>
                <Col span={8}><strong>Process owner</strong></Col>
                <Col span={16}>{this.getProcessOwner(dataSource)}</Col>
              </Row>
              <Row>
                <Col span={8}><strong>Organizational unit</strong></Col>
                <Col span={16}>{this.getOu(dataSource)}</Col>
              </Row>
              {this.objectModifiedDate(simplefied, dataSource)}
            </Card>  
          )
        }}
      </Query>
    )  
  }
}    

class ProcesBranchCard extends React.Component {
  Leaf = leaf =>{
    if(leaf.children.current){
      return <strong>{leaf.children.name}</strong>
    }else{
      return <InfoLink target={{label: leaf.children.name, linkPath: "/processes", id: leaf.children.id, Component: ProcesInfoCard}}/>
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

          const dataSource = data.Process || [];
          const orderedBranch = orderBranch(dataSource)
          
          return(
            <Card 
              loading = {loading}
              title= "Process Hierarchy"
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

class viewProcess extends React.Component {      
  state = {
    tabkey: 'processingActivity',
  }

  render () {   
    const tabListNoTitle = [{
      key: 'processingActivity',
      tab: 'Processing Activity',
    },{
      key: 'applications',
      tab: 'Applications',
    }];
    
    const tabbedContent = {
      processingActivity: <ProcessingActivityTable processId = { this.props.match.params.processId } />,
      applications: <p>applications</p>
    };

    return (
      <div>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={12} >
            <ProcesInfoCard id={this.props.match.params.processId}/>
          </Col>
          <Col span={12}>
            <ProcesBranchCard query={PROCESSES_BRANCH} id={this.props.match.params.processId} />
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

export default viewProcess