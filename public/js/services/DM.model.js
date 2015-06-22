/**
 * 缓存数据服务
 * 
 */
angular.module('DM.services',[])
	.factory('model', function($http, $q){
		var categories = [
				{content: '全部文件',style:'glyphicon-folder-close'},
				{content: '图片', style:'glyphicon-picture'},
				{content: '文档', style:'glyphicon-file'},
				{content: '视频', style:'glyphicon-film'},
				{content: '音乐', style:'glyphicon-music'},
				{content: '其它', style:'glyphicon-list-alt'},
			],
			files = [],
			baseUrl = 'http://localhost:3000',
	    	defer = $q.defer();

		function getCategories() {
			return categories;
		}
		
		/**
		 * 获取所有的文件
		 * @param  {[type]} url [description]
		 * @return {[type]}     [description]
		 */
		function getFiles(url) {
			url = baseUrl + url;
			return $http.get(url);
		}

		function sendPost(url, data) {
			url = baseUrl + url;
			return $http.post(url, data);
		}

		function create(url, data) {
			url = baseUrl + url;
			return $http.post(url, data);
		}

		/**
		 * 重命名文件夹或者目录
		 * @param  {[type]} url  [description]
		 * @param  {[type]} data [description]
		 * @return {[type]}      [description]
		 */
		function rename(url, data) {
			url = baseUrl + url;
			return $http.post(url, data);
		}

		/**
		 * [setCateories description]
		 * @param {[type]} cIndex  [description]
		 * @param {[type]} content [description]
		 */
		function setCateories(cIndex, content) {
			if(content) {
				categories.push({content: content})
			}
			else {
				categories.splice(index, 1);
			}
		};

		function setCategories() {

		}

		function getTask(index) {
			return allFiles;
		};

		function setTask(task) {
			allFiles.unshift(task);
		};

		function getDetail(index) {
			return allFiles[index];
		}

		return {
			getCategories: getCategories,
			getTask: getTask,
			detail: getDetail,
			setTask: setTask,
			getFiles: getFiles,
			create: create,
			sendPost: sendPost,
			rename: rename,
			files: files
		};
	})