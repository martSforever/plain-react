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

}

export class EditMixin {

    static defaultProps = {
        disabled: null,
        readonly: null,
        required: null,
        rules: null,
        validFunc: null,
        validOnInit: null,
    }

    data() {
        return {
            p_disabled: this.disabled,
            p_readonly: this.readonly,

            isValid: true,
        }
    }

    watch() {
        return {
            disabled(val) {
                this.p_disabled !== val && (this.p_disabled = val)
            },
            readonly(val) {
                this.p_readonly !== val && (this.p_readonly = val)
            },
        }
    }

    computed() {
        return {
            editBinding() {
                const props = [
                    'p_disabled',
                    'p_readonly',
                    'disabled',
                    'readonly',
                    'required',
                    'rules',
                    'validFunc',
                    'validOnInit',
                ]
                return props.reduce((ret, item) => {
                    ret[item] = this[item]
                    return ret
                }, {})
            },
            editListening() {
                return {
                    'update:isValid': (val) => this.isValid = val,
                    'update:p_disabled': (val) => this.p_disabled = val,
                    'update:p_readonly': (val) => this.p_readonly = val,
                }
            },
        }
    }
}