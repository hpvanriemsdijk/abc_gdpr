import gql from 'graphql-tag'

export const LEGAL_GROUND_OPTIONS_LIST = gql`
	query LegalGrounds {
		legalGrounds {
			value: id
			title: name
		}
	}
`;
