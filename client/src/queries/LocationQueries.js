import gql from 'graphql-tag'

export const MY_LOCATIONS_OPTIONS_LIST = gql`
    query MyLocations {  
        locations(
            where: {
            businessPartner: null
            }
        ){
			value: id
			title: name
        }
    }
`;