import {Dep} from "./Dep";
import {Watcher} from "./Watcher";

function defineReactive(data, key, val, fn) {
    const dep = new Dep()
    Object.defineProperty(data, key, {
        configurable: true,
        enumerable: true,
        get: function () {
            dep.depend()
            return val
        },
        set: function (newVal) {
            if (newVal === val) return
            fn && fn(newVal)
            val = newVal
            dep.notify()
        },
    })
}

function initData(data) {
    Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
}

function computed(data, computed) {
    let keys = Object.keys(computed)
    keys.reduce((ret, key) => {

        const watcher = new Watcher(key, computed[key])

        Object.defineProperty(data, key, {
            configurable: true,
            enumerable: true,
            get: function () {
                if (watcher.dirty) {
                    watcher.evaluate()
                }
                if (Dep.target) {
                    watcher.depend()
                }
                return watcher.value
            },
            set: function () {
            },
        })
        return ret

    }, {})
}

const hero = {
    a: 111,
    b: 222,
    c: 333,
    d: 444,
}

initData(hero)

computed(hero, {
    ab() {
        console.log('----------------reset ab-----------------')
        return hero.a + '' + hero.b
    },
    cd() {
        console.log('----------------reset cd-----------------')
        return hero.c + '' + hero.d
    },
    abab() {
        console.log('----------------reset abab-----------------')
        return hero.ab + '-->>' + hero.ab
    },
})

console.log('ab-->>', hero.ab)
console.log('ab-->>', hero.ab)
console.log('ab-->>', hero.ab)
console.log('abab-->>', hero.abab)
console.log('abab-->>', hero.abab)

console.log('')
console.log('||||||||||||||||||||||||||||||||')
console.log('')

console.log('set a=aaa')
hero.a = 'aaa'
console.log('ab-->>', hero.ab)

console.log('')
console.log('||||||||||||||||||||||||||||||||')
console.log('')

console.log('set b=bbb')
hero.b = 'bbb'
console.log('ab-->>', hero.ab)
console.log('abab-->>', hero.abab)

console.log('')
console.log('||||||||||||||||||||||||||||||||')
console.log('')

console.log('set a=111,b=222')
hero.a = '111'
hero.b = '222'
console.log('ab-->>', hero.ab)
console.log('ab-->>', hero.ab)
console.log('ab-->>', hero.ab)
console.log('abab-->>', hero.abab)
console.log('abab-->>', hero.abab)
