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