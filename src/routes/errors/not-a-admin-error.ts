export class NotAAdminError extends Error {
	constructor() {
		super("User is not an admin.")
	}
}
