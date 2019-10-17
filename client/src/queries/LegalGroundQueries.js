import gql from 'graphql-tag'

export const LEGAL_GROUND_OPTIONS_LIST = gql`
	query LegalGrounds {
		legalGrounds {
			value: id
			title: name
		}
	}
`;

export const ALL_LEGAL_GROUNDS = gql`
	query LegalGrounds {
		legalGrounds {
			id
			name
			description
		}
	}
`;

export const CREATE_LEGAL_GROUND = gql`
	mutation CreateLegalGround ($data: LegalGroundCreateInput!) {
		createLegalGround(data: $data) {
			id
            name
            description 
		}
	}
`;

export const GET_LEGAL_GROUND = gql`
	query LegalGround ($id: ID!) { 
		legalGround(where:{id: $id}) {
			id
			name
			description
		}
	}
`;

export const UPDATE_LEGAL_GROUND = gql`
	mutation UpdateLegalGround ($id: ID!, $data: LegalGroundUpdateInput!) {
		updateLegalGround(
			data: $data, 
			where: {id: $id}
		) {
			id
			name
			description
		}
	}
`;