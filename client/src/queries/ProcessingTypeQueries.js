import gql from 'graphql-tag'

export const PROCESSING_TYPE_OPTIONS_LIST = gql`
	query ProcessingTypes {
		processingTypes {
			value: id
			title: name
		}
	}
`;
