/**
 * 缓存数据服务
 * 
 */
angular.module('DM.services',[])
	.factory('model', function(){
		var categories = [
				{content: '全部文件',style:'glyphicon-folder-close'},
				{content: '图片', style:'glyphicon-picture'},
				{content: '文档', style:'glyphicon-file'},
				{content: '视频', style:'glyphicon-film'},
				{content: '音乐', style:'glyphicon-music'},
				{content: '其它', style:'glyphicon-list-alt'},
			],
			allFiles = [
				{ filename: '美剧', selected: false, size: '-', date: '2014-03-10 17:07'},
    			{ filename: 'python', selected: false, size: '-', date: '2014-03-10 17:07'},
    			{ filename: '电影', selected: false, size: '-', date: '2014-03-10 17:07'},
    			{ filename: 'SICP', selected: false, size: '-', date: '2014-03-10 17:07'},
	    		{ filename: '大学', selected: false, size: '-', date: '2014-03-10 17:07'},
	    		{ filename: '英语', selected: false, size: '-', date: '2014-03-10 17:07'},
	    		{ filename: '前端', selected: false, size: '-', date: '2014-03-10 17:07'}
	    	];

		function getCategories() {
			return categories;
		};

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
			allFiles:allFiles
		};
	})