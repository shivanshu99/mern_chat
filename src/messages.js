const generateMessage = text => {
	return {
		text,
		createdAt: new Date().getTime()
	};
};
export const generateLocMessage = url => {
	return {
		url,
		createdAt: new Date().getTime()
	};
};
export default generateMessage ;
