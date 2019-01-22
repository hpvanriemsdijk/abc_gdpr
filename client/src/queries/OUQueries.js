import gql from 'graphql-tag'

export const ALL_OUS = gql`
	query AllOrganizationalUnits ($filter: OrganizationalUnitFilter) {
		allOrganizationalUnits(
			filter:$filter
		) {
			id
			name
			description
			legalEntity
			_processesMeta{count}
		}
	}
`;

export const CREATE_OU = gql`
	mutation CreateOrganizationalUnit ($name: String!, $description: String, $legalEntity: Boolean!) {
		createOrganizationalUnit(name: $name, description: $description, legalEntity: $legalEntity) {
			id
		}
	}
`;

export const GET_OU = gql`
	query OrganizationalUnit ($id: ID!) { 
		OrganizationalUnit(id: $id) {
			id
			name
			description
			legalEntity
		}
	}
`;

export const UPDATE_OU = gql`
	mutation UpdateOrganizationalUnit ($id: ID!, $name: String!, $description: String, $legalEntity: Boolean!) {
		updateOrganizationalUnit(id: $id, name: $name, description: $description, legalEntity: $legalEntity) {
			id
		}
	}
`;

export const DELETE_OU = gql`
	mutation DeleteOrganizationalUnit ($id: ID!) {
		deleteOrganizationalUnit(id: $id) {
			id
		}
	}
`;