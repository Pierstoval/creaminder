import {invoke} from "@tauri-apps/api/core";

/**
 * @return Promise<string> with a JSON-serialized version of the expected data.
 */
export default function api_call(command: string, params = {}): Promise<string> {
	if (typeof window !== 'undefined') {
		console.info('Api call', command, params);
		return invoke(command, params);
	}

	return Promise.reject('No API detected.');
}
