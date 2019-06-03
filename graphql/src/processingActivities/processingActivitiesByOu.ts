import { fromEvent, FunctionEvent } from 'graphcool-lib'
import { GraphQLClient } from 'graphql-request'

interface EventData {
  organizationalUnitId: string
}

interface OrganizationalUnit{
  allOrganizationalUnits: object
}

export default async (event: FunctionEvent<EventData>) => {
  const { organizationalUnitId } = event.data

  const flattenOuProcessingActivities = (obj) => {
    let processingActivities: any[] = []

    if(obj.processes){
      obj.processes.forEach(function(process) {
        process.processingActivities.forEach(function(processingActivity) {
          processingActivity["organizationalUnit"] = {id: obj.id, name: obj.name }
          processingActivity["process"] = {id: process.id, name: process.name }
          processingActivities = processingActivities.concat(processingActivity)
        })
      });
    } 
  
    if (obj.children) {
      obj.children.forEach(function (d) {
        processingActivities = processingActivities.concat(flattenOuProcessingActivities(d))
      })
    }

    return processingActivities
  }

  try {  
    const graphcool = fromEvent(event)
    const api = graphcool.api('simple/v1')

    // get process by id
    const organizationalUnit = await getProcessingActivities(api, organizationalUnitId)
      .then(r => {
        return r.allOrganizationalUnits[0]
      })

      if (!organizationalUnit || !organizationalUnit.id) {
        return { data: null }
      }

      return {
        data: flattenOuProcessingActivities(organizationalUnit)
      }
    } catch (e) {
      console.log(e)
      return { error: 'An unexpected error occured.' }
    }
  }

  async function getProcessingActivities(api: GraphQLClient, organizationalUnitId: string): 
  Promise<OrganizationalUnit> {
    const query = `
    fragment processFields on Process {
      id
      name
      processingActivities {
        id 
        name
        description
        purpose
      }
    }
        
    fragment flatOrganizationalUnitFields on OrganizationalUnit {
      id
      name
      processes {
        ...processFields
      }
    }
    
    query AllOrganizationalUnit($filter: OrganizationalUnitFilter) {
      allOrganizationalUnits(filter: $filter) {
        ...flatOrganizationalUnitFields
        children {
          ...flatOrganizationalUnitFields
          children {
            ...flatOrganizationalUnitFields
          }
        }
      }
    }
    `
  const variables = {
    "filter": {
      "id": organizationalUnitId
    }
  }
  
    return api.request<OrganizationalUnit>(query, variables)
  }
  