import {$utils} from "../scripts/utils";

const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: $utils.noop,
    set: $utils.noop
}

export function proxy(target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter() {
        return this[sourceKey][key]
    }
    sharedPropertyDefinition.set = function proxySetter(val) {
        this.setState({[key]: val})
    }
    Object.defineProperty(target, key, sharedPropertyDefinition)
}