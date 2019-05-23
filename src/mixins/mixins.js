export class MountedMixin {

    data() {
        return {
            p_mounted: false,
        }
    }

    created() {
        console.log('created MountedMixin',)
    }

    mounted() {
        console.log('mounted MountedMixin',)
        this.p_mounted = true
    }

}

export class ThrottleMixin {
    created() {
        console.log('created ThrottleMixin')
    }

    mounted() {
        console.log('mounted ThrottleMixin')
    }
}