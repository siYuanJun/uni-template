export default {
    data() {
        return {
            fileList1: [],
            fileList3: []
        };
    },
    onLoad() {
        console.log(this.fileList1)
    },
    methods: {
        async afterRead(event) {
            // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
            console.log(event)

            let lists = [].concat(event.file)
            let fileListLen = this[`fileList${event.name}`].length
            lists.map((item) => {
                this[`fileList${event.name}`].push({
                    ...item,
                    status: 'uploading',
                    message: '上传中'
                })
            })

            for (let i = 0; i < lists.length; i++) {
                const result = await this.$sys.$request.common.upload(lists[i].url)
                console.log('上传请求', result)

                let item = this[`fileList${event.name}`][fileListLen]
                this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
                    status: 'success',
                    message: '',
                    fileData: result
                }))

                fileListLen++
            }

            console.log(this[`fileList${event.name}`])
        },
        uploadChooseImage() {
            uni.chooseImage({
            	count: 6, //默认9
            	sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
            	sourceType: ['album'], //从相册选择
            	success: function (res) {
            		console.log(JSON.stringify(res));
            	}
            });
        },
        deletePic(event) {
            this[`fileList${event.name}`].splice(event.index, 1)
        },
    }
};
