export const verifyEmailTemplate = (name) => {
	return `
            <h2>Welcome, ${name.name}</h2>
            <p>Your account has been created successfully.</p>
            <p>Thank you for registering with us.</p>
            <a href=${name.url} style="color:white; background:blue; margin-top:10px">Verify email</a>
       `;
};
