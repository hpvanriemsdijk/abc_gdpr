import React from 'react'
import { Query } from 'react-apollo'
import { Card, Row, Col } from 'antd';
import { GET_PROCESS, PROCESSES_BRANCH } from '../../queries/ProcessQueries';
import ViewBusinessRole from '../businessRoles/ViewBusinessRole'
import ViewOU from '../organizationalUnits/ViewOU'
import UpdateProcess from './UpdateProcess'
import ProcessingActivityTable from '../processingActivities/ListProcessingActivities'
import { ObjectModifiedDate, InfoLink } from '../generic/viewHelpers'
import  '../generic/treeHelpers.css'

class ProcesInfoCard extends React.Component {
  getProcessOwner = (obj) => {
    if(obj.processOwner){
      return <InfoLink target={{label: obj.processOwner.name, linkPath: "/businessRoles", id: obj.processOwner.id, Component: ViewBusinessRole}}/>
    } else {
      return "No owner assigned"
    }
  }

  getOu = (obj) => {
    if(obj.organizationalUnit){
      return <InfoLink target={{label: obj.organizationalUnit.name, linkPath: "/units", id: obj.organizationalUnit.id, Component: ViewOU}}/>
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
        <Col span={8} style={{ textAlign:'right' }}><ObjectModifiedDate>{obj}</ObjectModifiedDate></Col>
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
          const dataSource = data.Process || [];

          if(error) return "Some error..."

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
  orderBranch = obj => { 
    var tmp = {id: obj.id, name: obj.name, child: [], current: true }

    //Order childeren
    if(obj.children) obj.children.forEach(function(itemsL2, i){
      tmp.child[i] = {id: itemsL2.id, name: itemsL2.name, child: []};
      if(itemsL2.children) itemsL2.children.forEach(function(itemsL3, y){
        tmp.child[i].child[y] = {id: itemsL3.id, name: itemsL3.name, child: []};
      })
    })

    //Order Parents
    if(obj.parent){
      tmp = {id: obj.parent.id, name: obj.parent.name, child: [tmp] }
      if(obj.parent.parent){
        tmp = {id: obj.parent.parent.id, name: obj.parent.parent.name, child: [tmp] }
      }      
    }

    return tmp
  };

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
        {({ loading, data }) => {
          const dataSource = data.Process || [];
          const orderedBranch = this.orderBranch(dataSource)
          
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
    
    const contentListNoTitle = {
      processingActivity: <ProcessingActivityTable 
                            processId = { this.props.match.params.processId }
                            />,
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
              {contentListNoTitle[this.state.tabkey]}
            </Card>
          </Col>
        </Row>                
      </div> 
    )
  }
}

export default viewProcess