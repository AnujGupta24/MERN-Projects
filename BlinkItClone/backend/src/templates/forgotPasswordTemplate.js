export const forgotPasswordTemplate = ({ name, otp }) => {
	return `
		<div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px;">
			<h2 style="color: #333;">Password Reset Request</h2>

			<p>Hello ${name},</p>

			<p>We received a request to reset your password.</p>

			<p>Your OTP for password reset is:</p>

			<h1 style="letter-spacing: 6px; color: #f23219; text-align: center; background-color: yellow; font-weight:bold">
				${otp}
			</h1>

			<p style="color: #d9534f; font-weight: bold;">
				This OTP will expire in 10 minutes.
			</p>

			<p>If you did not request this password reset, you can safely ignore this email.</p>

			<hr />

			<p style="font-size: 12px; color: #777;">
        From, Blinkit Clone Team
			</p>
		</div>
	`;
};
