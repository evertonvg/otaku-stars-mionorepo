export default {
	INVALID_CREDENTIALS: "Invalid credentials",
	ACCOUNT_NOT_VERIFIED: "Your account is not verified yet",
	LOGIN_SUCCESS: "Login successful",
	UNEXPECTED_ERROR: "An unexpected error occurred",
	INVALID_PAYLOAD: "Invalid request data.",
	USER_ALREADY_EXISTS: "User already exists.",
	DEFAULT_ROLE_NOT_FOUND: "Default role not found.",
	REGISTER_SUCCESS: "User registered successfully.",
	MISSING_EMAIL: "Email is required.",
	INVALID_IDENTIFIER: "Invalid identifier.",
	IF_EMAIL_REGISTERED_LINK_SENT: 'If the email is registered, the link will be sent.',
	ACTIVATED_EMAIL_ADVISE: 'Account is already activated.',
	ACTIVATION_EMAIL_SUBJECT: "Activate your account",
	TOKEN_NOT_PROVIDED: "Token not provided.",
	INVALID_TOKEN: "Invalid token.",
	TOKEN_EXPIRED: "Token expired.",
	USER_NOT_FOUND: "User not found.",
	ACTIVATION_SUCCESS: "Activation successful.",
	USER_ALREADY_VERIFIED: "User already verified.",

	// loginSchema
	USERNAME_TOO_SHORT: "The username must be at least 3 characters long",
	EMAIL_INVALID: "Invalid email format.",
	PASSWORD_TOO_SHORT: "The password must be at least 6 characters long",
	IDENTIFIER_REQUIRED: "The identifier must be at least 3 characters long",

	// registerSchema
	USERNAME_MIN_LENGTH: "The username must be at least 3 characters long.",
	INVALID_EMAIL: "Invalid email format.",
	PASSWORD_MIN_LENGTH: "The password must be at least 6 characters long.",

	// Email messages
	EMAIL_ACTIVATION_SUBJECT: "Activate your account",
	EMAIL_ACTIVATION_GREETING: "Hello, {username}!",
	EMAIL_ACTIVATION_BODY: "Thank you for registering. Click the link below to activate your account:",
	EMAIL_ACTIVATION_BUTTON: "Activate account",
	EMAIL_ACTIVATION_EXPIRES: "This link expires in 24 hours.",

	// Resend Activation
	RESEND_ACTIVATION_SUBJECT: "Resend activation link",
	RESEND_ACTIVATION_BODY: "You requested to resend the link to activate your account. Click below to activate:",
};
