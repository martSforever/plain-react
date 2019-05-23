import {$utils, $dom, StorageService} from "./utils";

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