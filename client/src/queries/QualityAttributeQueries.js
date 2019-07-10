import gql from 'graphql-tag'

export const qualityAttributeEnums = {
	objects: [
		{ label: 'Data', color: 'gold', value: 'DATA' },
		{ label: 'Applications', color: 'red', value: 'APPLICATION' }
	]
};

export const ALL_QUALITY_ATTRIBUTES = gql`
	query QualityAttributes ( $filter: QualityAttributeWhereInput ) {
		qualityAttributes (where: $filter) {
			id
			name
			appliesToObject
			description
			classificationLabels {
				id
				score
				criteria
				label
			}
		}
	}
`;

export const CREATE_QUALITY_ATTRIBUTE = gql`
	mutation CreateQualityAttribute ($data: QualityAttributeCreateInput!) {
		createQualityAttribute(data: $data) {
			id
		}
	}
`;

export const GET_QUALITY_ATTRIBUTE = gql`
	query QualityAttribute ($id: ID!) { 
		qualityAttribute(where:{id: $id}) {
			id
			name
			description
			appliesToObject
			classificationLabels {
				id
				score
				label
				criteria
			}
		}
	}
`;

export const UPDATE_QUALITY_ATTRIBUTE = gql`
	mutation UpdateQualityAttribute ($id: ID!, $data: QualityAttributeUpdateInput!) {
		updateQualityAttribute(
			data: $data, 
			where: {id: $id}
		) {
			id
		}
	}
`;

export const DELETE_QUALITY_ATTRIBUTE = gql`
	mutation DeleteQualityAttribute ($id: ID!) {
		deleteQualityAttribute(where:{id: $id}) {
			id
		}
	}
`;