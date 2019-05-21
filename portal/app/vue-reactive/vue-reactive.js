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

function computed(data, computed) {
    let keys = Object.keys(computed)
    keys.reduce((ret, key) => {
        const watcher = new Watcher(data, key, computed[key])
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

function watch(data, watch) {
    Object.keys(watch).forEach(key => {
        const handler = watch[key]
        const watcher = new Watcher(data, key, key, handler, true)
    })
}

function initData(data) {
    Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
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
        return hero.ab + '+++' + hero.ab
    },
})

watch(hero, {
    a(newVal, oldVal) {
        console.log(`a change from [${oldVal}] to [${newVal}]`)
    },
    b(newVal, oldVal) {
        console.log(`b change from [${oldVal}] to [${newVal}]`)
    },
})

export function changeA(val) {
    console.log('changeA')
    hero.a = val
}

export function changeB(val) {
    console.log('changeB')
    hero.b = val
}

/*console.log('这里测试读取三次ab以及读取两次abab，结果是第一次读取ab的时候执行了一次ab，第一次读取abab的时候执行了一次abab，符合预期')
console.log('ab\t\t\t\t', hero.ab)
console.log('ab\t\t\t\t', hero.ab)
console.log('ab\t\t\t\t', hero.ab)
console.log('abab\t\t\t\t', hero.abab)
console.log('abab\t\t\t\t', hero.abab)

console.log('')
console.log('||||||||||||||||||||||||||||||||')
console.log('')

console.log('这里测试重置a的值，然后读取两次ab，不读取abab，结果是第一次读取ab的时候执行了一次ab，没有执行abab，符合预期，因为此时没有使用abab，所以不需要重新计算abab')
console.log('set a=aaa')
hero.a = 'aaa'
console.log('ab\t\t\t\t', hero.ab)
console.log('ab\t\t\t\t', hero.ab)

console.log('')
console.log('||||||||||||||||||||||||||||||||')
console.log('')

console.log('这里测试重置b的值，然后重新读取ab以及abab各两次，结果都是第一次读取的时候执行了一次，符合预期')
console.log('set b=bbb')
hero.b = 'bbb'
console.log('ab\t\t\t\t', hero.ab)
console.log('abab\t\t\t\t', hero.abab)
console.log('ab\t\t\t\t', hero.ab)
console.log('abab\t\t\t\t', hero.abab)


console.log('')
console.log('||||||||||||||||||||||||||||||||')
console.log('')

console.log('这里测试同时重置a，b的值，然后读取三次ab，读取两次abab，结果是ab以及abab在第一次读取的时候执行了一次，符合预期')
console.log('set a=111,b=222')
hero.a = '111'
hero.b = '222'
console.log('ab\t\t\t\t', hero.ab)
console.log('ab\t\t\t\t', hero.ab)
console.log('ab\t\t\t\t', hero.ab)
console.log('abab\t\t\t\t', hero.abab)
console.log('abab\t\t\t\t', hero.abab)

console.log('')
console.log('||||||||||||||||||||||||||||||||')
console.log('')*/

console.log(hero.a)
hero.a = new Date().getTime()
console.log(hero.a)

