// API路由文件

const apiPrefix = '/api'

export const routeApi = {
	'api_index': '/api_index',
	'api_user': '/user',
}

for (let key in routeApi) {
    routeApi[key] = apiPrefix + routeApi[key]
}

export default routeApi


