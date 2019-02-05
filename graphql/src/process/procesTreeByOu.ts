import { fromEvent, FunctionEvent } from 'graphcool-lib'
import { GraphQLClient } from 'graphql-request'

interface EventData {
  organizationalUnitId: string
}

interface OrganizationalUnit{
  allOrganizationalUnits: object
}

export default async (event: FunctionEvent<EventData>) => {
  //console.log(event)
  const { organizationalUnitId } = event.data

  const flattenOuProcesses = (obj) => {
    let processes: any[] = []

    if(obj.processes){
      obj.processes.forEach(function(process) {process["organizationalUnit"] = {id: obj.id, name: obj.name }});
      processes = processes.concat(obj.processes)
    } 
  
    if (obj.children) {
      obj.children.forEach(function (d) {
        processes = processes.concat(flattenOuProcesses(d))
      })
    }

    return processes
  }

  try {  
    const graphcool = fromEvent(event)
    const api = graphcool.api('simple/v1')

    // get process by id
    const organizationalUnit = await getProcesses(api, organizationalUnitId)
      .then(r => {
        return r.allOrganizationalUnits[0]
      })

      if (!organizationalUnit || !organizationalUnit.id) {
        return { data: null }
      }

      return {
        data: flattenOuProcesses(organizationalUnit)
      }
    } catch (e) {
      console.log(e)
      return { error: 'An unexpected error occured.' }
    }
  }

  async function getProcesses(api: GraphQLClient, organizationalUnitId: string): 
  Promise<OrganizationalUnit> {
    const query = `
    fragment flatProcessFields on Process {
      id
      name
      description
      createdAt
      updatedAt
    }
    
    fragment nestedProcessFields on Process {
      ...flatProcessFields
      children {
        ...flatProcessFields
        children {
          ...flatProcessFields
        }
      }
    }
    
    fragment flatOrganizationalUnitFields on OrganizationalUnit {
      id
      name
      processes {
        ...nestedProcessFields
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
      "parent": null,
      "id": organizationalUnitId
    }
  }
  
    return api.request<OrganizationalUnit>(query, variables)
  }
  