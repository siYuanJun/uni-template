export default {
	data() {
		return {
			extConfig: []
		};
	},
	onLoad() {},
	onShow() {
		uni.setTabBarBadge({
			index: 0,
			text: '1'
		});
	},
	methods: {}
};
