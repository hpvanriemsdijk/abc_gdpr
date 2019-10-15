import gql from 'graphql-tag'

export const LEGAL_GROUND_OPTIONS_LIST = gql`
	query StaticSettingsGroup {  
		staticSettingsGroup(
			where: {group: "legalGround"}
		){
			value: id
			title: label
		}
	}
`;
