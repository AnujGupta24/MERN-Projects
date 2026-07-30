export class ApiResponse {
	constructor(statuscode, data = null, message = 'Success') {
		this.success = statuscode < 400;
		this.statuscode = statuscode;
		this.data = data;
		this.message = message;
	}
}
