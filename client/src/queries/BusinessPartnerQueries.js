import gql from 'graphql-tag'

export const ALL_BUSINESSPARTNERS = gql`
	query BusinessPartners {
		businessPartners{
			id
			name
		}
	}
`;

export const BUSINESS_PARTNER_OPTIONS_LIST = gql`
	query BusinessPartners {
		businessPartners {
			value: id
			title: name
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
			contactDetails
			representative {id, name}
			processingTypes {id, name}
			recipientsType {id, name}
			securityMeasures
			otherCountries
			outsideEea
			safeguards
			linkToDpa
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