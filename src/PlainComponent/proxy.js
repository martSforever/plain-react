import {$utils} from "../scripts/utils";

export const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: $utils.noop,
    set: $utils.noop
}