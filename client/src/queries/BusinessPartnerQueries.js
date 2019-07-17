import gql from 'graphql-tag'

export const ALL_BUSINESSPARTNERS = gql`
	query BusinessPartners {
		businessPartners{
			id
			name
		}
	}
`;

export const CREATE_BUSINESSPARTNER = gql`
	mutation CreateBusinessPartner ($data: BusinessPartnerCreateInput!) {
		createBusinessPartner(data: $data) {
			id
		}
	}
`;

export const GET_BUSINESSPARTNER = gql`
	query BusinessPartner ($id: ID!) { 
		businessPartner(where: {id: $id}) {
			id
			name
			description
			dpo
 			representative
			contactDetails
			headOffice{
				name
				description
				address
			}
		}
	}
`;

export const UPDATE_BUSINESSPARTNER = gql`
	mutation UpdateBusinessPartner ($id: ID!, $data: BusinessPartnerUpdateInput!) {
		updateBusinessPartner(
			data: $data, 
			where: {id: $id}
		){
			id
		}
	}
`;

export const DELETE_BUSINESSPARTNER = gql`
	mutation DeleteBusinessPartner ($id: ID!) {
		deleteBusinessPartner(where:{id: $id}) {
			id
		}
	}
`;