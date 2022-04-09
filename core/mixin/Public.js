
import mixinFun from '../function/mixinFun.js'

export default {
    data() {
        return {
            $baseUrl: this.$sys.$config.$baseUrl,
            $baseStatic: this.$sys.$config.$baseStatic,
            extConfig: {},
            messageNum: 0,
        };
    },
    onLoad() {
        console.info("core", this.$sys)

        this.extConfig = this.$sys.$request.common.getExtConfig()
    },
    onShow() {
    },
    methods: mixinFun
};
