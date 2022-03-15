export default(http, $tools) => ({
    getExtConfig(data) {
        return http.post("/common/statusMap", data)
    }
})
