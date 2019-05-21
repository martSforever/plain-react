import PlainUtils from 'plain-utils'
import {popTarget, pushTarget} from "./Dep";

const $utils = PlainUtils.$utils
let uid = 0

export const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/
const bailRE = new RegExp(`[^${unicodeRegExp.source}.$_\\d]`)

export function parsePath(path) {
    if (bailRE.test(path)) {
        return
    }
    const segments = path.split('.')
    return function (obj) {
        for (let i = 0; i < segments.length; i++) {
            if (!obj) return
            obj = obj[segments[i]]
        }
        return obj
    }
}

export class Watcher {
    getter
    key
    callback
    user
    data

    id
    dirty
    value
    deps = []
    newDeps = []
    depIds = new Set()
    newDepIds = new Set()
    active

    constructor(data, key, expressOrFunction, callback, user) {
        this.data = data
        this.key = key
        this.id = ++uid
        this.dirty = true
        this.value = undefined
        this.callback = callback
        this.active = true
        this.user = user

        switch ($utils.typeOf(expressOrFunction)) {
            case 'function':
                this.getter = expressOrFunction
                break;
            case 'string':
                this.getter = parsePath(expressOrFunction)
                break
        }
        if (!!this.user) {
            this.value = this.get()
            console.log('init touch:' + this.value)
        }
    }

    addDep(dep) {
        const id = dep.id
        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id)
            this.newDeps.push(dep)
            if (!this.depIds.has(id)) {
                dep.addSub(this)
            }
        }
    }

    depend() {
        this.deps.forEach(dep => dep.depend())
    }

    cleanupDeps() {
        let i = this.deps.length
        while (i--) {
            const dep = this.deps[i]
            if (!this.newDepIds.has(dep.id)) {
                dep.removeSub(this)
            }
        }
        let tmp = this.depIds
        this.depIds = this.newDepIds
        this.newDepIds = tmp
        this.newDepIds.clear()
        tmp = this.deps
        this.deps = this.newDeps
        this.newDeps = tmp
        this.newDeps.length = 0
    }

    /**
     * Evaluate the getter, and re-collect dependencies.
     */
    get() {
        pushTarget(this)
        let value
        try {
            value = this.getter.call(this.data, this.data)
        } catch (e) {
            console.error(e)
        } finally {
            popTarget()
            this.cleanupDeps()
        }
        return value
    }

    update() {
        this.dirty = true
        !!this.user && this.run()
    }

    evaluate() {
        this.value = this.get()
        this.dirty = false
    }

    /**
     * Scheduler job interface.
     * Will be called by the scheduler.
     */
    run() {
        if (this.active) {
            const value = this.get()
            if (value !== this.value || $utils.typeOf(value) === 'object' || this.deep) {
                const oldValue = this.value
                this.value = value
                !!this.callback && this.callback(value, oldValue)
            }
        }
    }
}
