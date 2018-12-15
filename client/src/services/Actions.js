import { client } from '../index';

export const logout = () => {
	localStorage.removeItem('graphcoolToken')
	client.resetStore(); 
	window.location.reload()
}
