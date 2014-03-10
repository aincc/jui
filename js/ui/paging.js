jui.define('ui.paging', [], function() {
	
	/**
	 * UI Class
	 * 
	 */
	var UI = function() {
		var activePage = 1, lastPage = 1;
		var $obj = { prev: null, list: null, next: null };
		
		
		/**
		 * Private Methods
		 * 
		 */
		function setEventAction(self) {
			self.addEvent($obj.prev, "click", function(e) {
				self.prev();
				return false;
			});
			
			self.addEvent($obj.next, "click", function(e) {
				self.next();
				return false;
			});
		}
		
		function setEventPage(self) {
			var $list = $obj.list.children(".page");
			
			self.addEvent($list, "click", function(e) {
				var page = parseInt($(e.currentTarget).text());
				self.page(page);
				
				return false;
			});
		}
		
		function setPageStyle(self, page) {
			var $list = $obj.list.children(".page");
			
			$list.each(function(i) {
				if($(this).text() == page) {
					$(this).addClass("active");
				} else {
					$(this).removeClass("active");
				}
			});
		}
		
		
		/**
		 * Public Methods & Options
		 * 
		 */
		this.setting = function() {
			return {
				options: {
					count: 0,		// 데이터 전체 개수
					pageCount: 10,	// 한페이지당 데이터 개수
					screenCount: 5	// 페이지 개수
				},
				valid: {
					reload: [ "integer" ],
					page: [ "integer" ]
				}
			}
		}
		
		this.init = function() {
			var self = this, opts = this.options;
			
			// 페이징 요소 설정
			$obj.prev = $(self.root).children(".prev");
			$obj.list = $(self.root).children(".list");
			$obj.next = $(self.root).children(".next");
			
			// Prev / Next 버튼 이벤트
			setEventAction(this);
			
			//
			this.reload();
			
			return this;
		}
		
		this.reload = function(count) {
			var count = (!count) ? this.options.count : count;
			
			activePage = 1;
			lastPage = Math.ceil(count / this.options.pageCount);
			
			this.page(activePage);
		}
		
		this.page = function(pNo) {
			if(!pNo) return activePage;
			
			var pages = [], 
				end = (lastPage < this.options.screenCount) ? lastPage : this.options.screenCount,
				start = pNo - Math.ceil(end / 2) + 1,
				start = (start < 1) ? 1 : start;
			
			activePage = (pNo > lastPage) ? lastPage : pNo;
			activePage = (pNo < 1) ? 1 : pNo;
			
			if(lastPage < start + end + 1) {
				for(var i = lastPage - end + 1; i < lastPage + 1; i++) {
					pages.push(i);
				}
				
				if(activePage > lastPage) activePage = lastPage;
			} else {
				for(var i = start; i < start + end; i++) {
					pages.push(i);
				}
			}
			
			// 템플릿 적용
			$obj.list.html(this.tpl["pages"]({ pages: pages, lastPage: lastPage }));
			
			setEventPage(this);
			setPageStyle(this, activePage);
			
			// 커스텀 이벤트 발생
			this.emit("page", [ activePage ]);
		}

		this.next = function() {
			this.page(activePage + 1);
		}
		
		this.prev = function() {
			this.page(activePage - 1);
		}
		
		this.first = function() {
			this.page(1);
		}

		this.last = function() {
			this.page(lastPage);
		}
	}
	
	return UI;
});