let depId = 0

export class Dep {
    static target;                                              //全局变量
    id;
    subs;

    constructor() {
        this.subs = []
        this.id = ++depId
        Dep.target = null
    }

    addSub(sub) {
        this.subs.push(sub)
    }

    removeSub(sub) {
        const index = this.subs.indexOf(sub)
        if (index > -1) this.subs.splice(index, 1)
    }

    depend() {
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    }

    notify() {
        const subs = this.subs.slice()
        subs.sort((a, b) => a.id - b.id)
        for (let i = 0, l = subs.length; i < l; i++) {
            subs[i].update()
        }
    }
}

const targetStack = []

Dep.target = undefined

export function pushTarget(target) {
    targetStack.push(target)
    Dep.target = target
}

export function popTarget() {
    targetStack.pop()
    Dep.target = targetStack[targetStack.length - 1]
}