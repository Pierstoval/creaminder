import {invoke, InvokeArgs} from "@tauri-apps/api/core";

type DefaultApiCallResult = string|Array<unknown>|{[key: string]: unknown}|void;

/**
 * @return {Promise} With a JSON-parsed version of the expected data.
 */
export default function api_call<O = DefaultApiCallResult>(
	command: string,
	params?: InvokeArgs|undefined,
): Promise<O> {
	if (typeof window !== 'undefined' || !invoke) {
		console.log(`[${(new Date()).toJSON()}] Api call`, command, params);
		return invoke(command, params);
	}

	return Promise.reject('No API detected.');
}
