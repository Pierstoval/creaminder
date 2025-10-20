import {invoke} from "@tauri-apps/api/core";

/**
 * @return {Promise} With a JSON-parsed version of the expected data.
 */
export default function api_call(
	command: string,
	params: {[key: string]: unknown} = {},
): Promise<string|Array<unknown>|{[key: string]: unknown}> {
	if (typeof window !== 'undefined') {
		console.info('Api call', command, params);
		return invoke(command, params);
	}

	return Promise.reject('No API detected.');
}
