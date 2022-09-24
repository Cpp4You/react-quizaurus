type Opt<T> = T | undefined;

/**
 * Picks the first parameter that is not equal to undefined (left to right priority).
 * @param options list of arguments of the same type
 * @returns 
 */
export default function pick<T>(...options: Opt<T>[]): T {
	for (const elem of options) {
		if (elem !== undefined)
			return elem;
	}
	// Should be unreachable with a valid code 
	throw "\"pick\" called with all arguments being undefined. Provide the default value at the end of the list (lowest priority)";
}
