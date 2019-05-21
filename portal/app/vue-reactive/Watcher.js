import {popTarget, pushTarget} from "./Dep";

let uid = 0

export class Watcher {
    id

    dirty
    getter
    value

    deps = []
    newDeps = []

    depIds = new Set()
    newDepIds = new Set()

    key

    constructor(key, getter) {
        this.key = key
        this.id = ++uid
        this.dirty = true
        this.getter = getter
        this.value = undefined
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
            value = this.getter.call()
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
    }

    evaluate() {
        this.value = this.get()
        this.dirty = false
    }
}
