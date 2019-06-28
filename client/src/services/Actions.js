import { client } from '../index';

export const logout = () => {
	localStorage.removeItem('id_token')
	client.resetStore(); 
	window.location.reload()
}
