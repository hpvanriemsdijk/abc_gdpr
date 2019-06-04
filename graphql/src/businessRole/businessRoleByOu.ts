import { fromEvent, FunctionEvent } from 'graphcool-lib'
import { GraphQLClient } from 'graphql-request'

interface EventData {
  organizationalUnitId: string
}

interface OrganizationalUnit{
  allOrganizationalUnits: object
}

interface BusinessRoles{
  allBusinessRoles: object
}

export default async (event: FunctionEvent<EventData>) => {
  const { organizationalUnitId } = event.data

  try {  
    const graphcool = fromEvent(event)
    const api = graphcool.api('simple/v1')
    let ouList = [organizationalUnitId]

    // get process by id
    const parentOUs = await getParentOUs(api, organizationalUnitId)
      .then(r => {
        return r.allOrganizationalUnits[0]
      })

    //Add parent ou's to array
    if (parentOUs  && parentOUs.parent) {
      ouList.push(parentOUs.parent.id)
      if (parentOUs.parent.parent) {
        ouList.push(parentOUs.parent.parent.id)
      }
    }      

    const businessRoles = await getBusinessRoles(api, ouList)
      .then(r => {
        return r.allBusinessRoles
      })

    return {
      data: businessRoles
    }
  } catch (e) {
    console.log(e)
    return { error: 'An unexpected error occured.' }
  }
}


async function getParentOUs(api: GraphQLClient, organizationalUnitId: string): 
Promise<OrganizationalUnit> {
  const query = `
  query AllOrganizationalUnit($filter: OrganizationalUnitFilter) {
    allOrganizationalUnits(filter: $filter) {
      parent {
        id
        parent {
          id
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
  
async function getBusinessRoles(api: GraphQLClient, organizationalUnitIds: string[]): 
Promise<BusinessRoles> {
  const query = `
  query AllBusinessRoles($filter: BusinessRoleFilter) {
    allBusinessRoles(filter: $filter) {
      id
      name
      description
      raciPrivacy
      raciSecurity
      raciFinancial
      raciExecutive
      person {
        id
        name
        surname
      }
      organizationalUnit{
        id
        name
      }
      process{
        id
        name
      }
    }
  }
  `
const variables = {
  "filter": {
    "organizationalUnit": { 
      "id_in": organizationalUnitIds
    } 
  }
}

  return api.request<BusinessRoles>(query, variables)
}