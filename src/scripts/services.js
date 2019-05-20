import PlainUtils from 'plain-utils'

const {$utils, $dom, StorageService} = PlainUtils

export default function Service($plain) {
    const service = {
        inner: {
            $utils,
            $dom,
            $storage: new StorageService($plain)
        },
        outer: {},
    }

    Object.assign($plain, service.inner)
}