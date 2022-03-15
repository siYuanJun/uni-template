
import mixinFun from '@/plugins/mixinFun.js'

export default {
    data() {
        return {
            $baseUrl: this.$baseUrl,
            $baseStatic: this.$baseStatic,
            extConfig: {},
            messageNum: 0,
        };
    },
    onLoad() {
        this.extConfig = this.$request.common.getExtConfig()
    },
    onShow() {
    },
    methods: mixinFun
};
