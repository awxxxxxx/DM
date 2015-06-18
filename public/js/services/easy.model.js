/**
 * 缓存数据服务
 * 
 */
angular.module('easyToDo.services',[])
	.factory('model', function(){
		var categories = [
				{content: '全部文件',style:'glyphicon-folder-close'},
				{content: '图片', style:'glyphicon-picture'},
				{content: '文档', style:'glyphicon-file'},
				{content: '视频', style:'glyphicon-film'},
				{content: '音乐', style:'glyphicon-music'},
				{content: '其它', style:'glyphicon-list-alt'},
			],
			allTasks = [
				
					{ title: "美剧", selected: false},
    				{ title: "python", selected: false},
    				{ title: "电影", selected: false},
    				{ title: 'SICP', selected: true },
	    			{ title: '大学', selected: true },
	    			{ title: '英语', selected: true },
	    			{ title: '前端', selected: true }

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
			return allTasks;
		};

		function setTask(task) {
			allTasks.unshift(task);
		};

		function getDetail(index) {
			return allTasks[index];
		}

		return {
			getCategories: getCategories,
			getTask: getTask,
			detail: getDetail,
			setTask: setTask,
			allTasks:allTasks
		};
	})