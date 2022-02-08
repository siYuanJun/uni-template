
import mixinFun from '@/plugins/mixinFun.js'
import common from '@/plugins/model/common.js'

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
        this.extConfig = common.getExtConfig()
    },
    onShow() {
    },
    methods: mixinFun
};
