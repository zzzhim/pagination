(function() {
    /**
     *
     * 分页
     * @author zzzhim
     * @date 2020-03-11
     * @param { HTMLElement } container 分页容器
     * @param { string } elementIdName 分页 Class 名称，默认为 'pagination' + (new Date().getTime()).toString()
     * @param { number } total 总条数
     * @param { number } pageSize 每页条数
     * @param { number } currentPage 默认页数
     * @param { function } cb 分页触发回调
     * @param { boolean } isShowPrevPageBtn 是否显示上一页
     * @param { boolean } isShowNextPageBtn 是否显示下一页
     * @param { boolean } isShowInput 是否显示跳转输入框
     */
    var Pagination = /** @class */ (function () {
        function Pagination(params) {
            this.state = {
                container: params.container,
                elementIdName: params.elementIdName || 'pagination' + (new Date().getTime()).toString(),
                total: params.total === undefined ? 100 : params.total,
                pageSize: params.pageSize === undefined ? 10 : params.pageSize,
                currentPage: params.currentPage || 1,
                cb: params.cb,
                isShowPrevPageBtn: params.isShowPrevPageBtn === undefined ? true : params.isShowPrevPageBtn,
                isShowNextPageBtn: params.isShowNextPageBtn === undefined ? true : params.isShowNextPageBtn,
                isShowInput: params.isShowInput === undefined ? true: params.isShowInput,
                totalPageSize: Math.ceil((params.total === undefined ? 100 : params.total) / (params.pageSize === undefined ? 10 : params.pageSize))
            }
            this.renderDom()
        }
    
        Pagination.prototype.leftShow = function() {
            $('.' + this.state.elementIdName + '> .page-item[data-toggle="page-left"]').show().prev().show()
            return this
        }
    
        Pagination.prototype.rightShow = function() {
            $('.' + this.state.elementIdName + '> .page-item[data-toggle="page-right"]').show().next().show().children('a').text(this.state.totalPageSize)
            return this
        }
    
        Pagination.prototype.leftHide = function() {
            $('.' + this.state.elementIdName + '> .page-item[data-toggle="page-left"]').hide().prev().hide()
            return this
        }
    
        Pagination.prototype.rightHide = function() {
            $('.' + this.state.elementIdName + '> .page-item[data-toggle="page-right"]').hide().next().hide()
            return this
        }
    
        Pagination.prototype.switchPage = function(data) {
            var elementIdName = '.' + this.state.elementIdName
            var paginationList = $(elementIdName + ' > .page-item')
            var totalCount = this.state.total
            var pageSize = this.state.pageSize
            var currentPage = data.currentPage
            var list = $(elementIdName + ' > .page-item[data-toggle="page-item"] > a')
    
            paginationList.each(function() {
                $(this).removeClass('active')
            })
    
            // 总页数小于等于6个
            if(this.state.totalPageSize <= 6) {
                if(this.state.totalPageSize <= 5) {
                    var that = this
                    list.each(function(i) {
                        list.eq(i).parent().hide()
                    })
                    list.each(function(i) {
                        var text = i + 1
                        if(text == currentPage) {
                            list.eq(i).parent().addClass('active')
                        }
    
                        if(that.state.totalPageSize - 1 >= i) {
                            list.eq(i).text(text).parent().show()
                        }
                    })
                }else {
                    var index = currentPage != 1 ? 2 : 1
                    list.each(function(i) {
                        var text = index + i
                        if(text == currentPage) {
                            list.eq(i).parent().addClass('active')
                        }
                        list.eq(i).text(text).parent().show()
                    })
                }
                return this.leftHide().rightHide().callback(data)
            }else {
                list.each(function(i) {
                    list.eq(i).parent().show()
                })
    
                // 两侧都有省略号
                if(currentPage >= 5 && currentPage <= (this.state.totalPageSize - 4)) {
                    list.eq(0).text(currentPage - 2)
                    list.eq(1).text(currentPage - 1)
                    list.eq(2).text(currentPage).parent().addClass('active')
                    list.eq(3).text(currentPage + 1)
                    list.eq(4).text(currentPage + 2)
                    return this.leftShow().rightShow().callback(data)
                }
    
                // 只有左侧有省略号
                if(this.state.totalPageSize > 7 && currentPage > 2 && currentPage > (this.state.totalPageSize - 4)) {
                    var text = this.state.totalPageSize - 4
                    list.each(function(i) {
                        if(text + i === currentPage) {
                            list.eq(i).parent().addClass('active')
                        }
                        list.eq(i).text(text + i)
                    })
                    return this.leftShow().rightHide().callback(data)
                }
    
                // 只有右侧有省略号
                if(currentPage < 5 && currentPage <= (this.state.totalPageSize - 4) && (this.state.totalPageSize - 4) > 2) {
                    list.each(function(i) {
                        if((i + 1) === currentPage) {
                            list.eq(i).parent().addClass('active')
                        }
                        list.eq(i).text(i + 1)
                    })
                    return this.rightShow().leftHide().callback(data)
                }
            }
        }
    
        // 更新总条数
        Pagination.prototype.updateTotal= function(total, currentPage) {
            this.state.total = total
            this.state.totalPageSize = Math.ceil(this.state.total / this.state.pageSize)
            this.switchPage({ currentPage: currentPage === undefined ? this.state.currentPage : currentPage, isCb: false })
        }
    
        // 更新每页条数
        Pagination.prototype.updatePageSize= function(pageSize, currentPage) {
            this.state.pageSize = pageSize
            this.state.totalPageSize = Math.ceil(this.state.total / this.state.pageSize)
            this.switchPage({ currentPage: currentPage === undefined ? this.state.currentPage : currentPage, isCb: false })
        }
    
        // 渲染分页 HTML
        Pagination.prototype.renderDom = function () {
            var elementIdName = this.state.elementIdName
            var str = ''
            str = str + '<ul class="' + elementIdName + ' d-flex justify-content-center">'
            if(this.state.isShowPrevPageBtn) {
                str = str + '<li class="page-item" data-toggle="page-prev"><a class="page-link text-reset" href="javascript:void(0)" data-toggle="page-prev">上一页</a></li>'
            }
            str = str + '<li class="page-item active" data-toggle="page-first"><a class="page-link text-reset" href="javascript:void(0)" data-toggle="page-first">1</a></li>'
            str = str + '<li class="page-item" data-toggle="page-left"><a class="page-link text-reset" href="javascript:void(0)" data-toggle="page-left">···</a></li>'
            str = str + '<li class="page-item" data-toggle="page-item"><a class="page-link text-reset" href="javascript:void(0)" data-toggle="page-item">3</a></li>'
            str = str + '<li class="page-item" data-toggle="page-item"><a class="page-link text-reset" href="javascript:void(0)" data-toggle="page-item">4</a></li>'
            str = str + '<li class="page-item" data-toggle="page-item"><a class="page-link text-reset" href="javascript:void(0)" data-toggle="page-item">5</a></li>'
            str = str + '<li class="page-item" data-toggle="page-item"><a class="page-link text-reset" href="javascript:void(0)" data-toggle="page-item">6</a></li>'
            str = str + '<li class="page-item" data-toggle="page-item"><a class="page-link text-reset" href="javascript:void(0)" data-toggle="page-item">7</a></li>'
            str = str + '<li class="page-item" data-toggle="page-right"><a class="page-link text-reset" href="javascript:void(0)" data-toggle="page-right">···</a></li>'
            str = str + '<li class="page-item" data-toggle="page-last"><a class="page-link text-reset" href="javascript:void(0)" data-toggle="page-last">9</a></li>'
            if(this.state.isShowNextPageBtn) {
                str = str + '<li class="page-item" data-toggle="page-next"><a class="page-link text-reset" href="javascript:void(0)" data-toggle="page-next">下一页</a></li>'
            }
    
            if(this.state.isShowInput) {
                str = str + '<li class="_jump">'
                str = str + '<div class="input-group">'
                str = str + '<input type="text" class="form-control" aria-label="" aria-describedby="button-addon2" data-toggle="page-input">'
                str = str + '<div class="input-group-append">'
                str = str + '<a href="javascript:void(0)">'
                str = str + '<button class="btn btn-outline-secondary" type="button" data-toggle="page-jump">跳转</button>'
                str = str + '</a>'
                str = str + '</div>'
                str = str + '</div>'
                str = str + '</li>'
            }
    
            str = str + '</ul>'
    
            this.state.container.innerHTML = str
    
            this.startEvent()
        }
    
        // 监听分页事件
        Pagination.prototype.startEvent = function () {
            var elementIdName = '.' + this.state.elementIdName
            var paginationList = $(elementIdName + ' > .page-item')
            var jump = $(elementIdName + ' button[data-toggle="page-jump"]')
            var input = $(elementIdName + ' input[data-toggle="page-input"]')
            var totalCount = this.state.total
            var pageSize = this.state.pageSize
            var that = this
            paginationList.click(function(e) {
                var toggle = e.target.getAttribute('data-toggle')
                var value =  Math.floor(e.target.innerHTML)
                // 分页
                if(toggle === 'page-item') {
                    that.switchPage({ currentPage: value })
                    return
                }
    
                // 第一页和最后一页
                if (toggle === 'page-first' || toggle === 'page-last') {
                    that.switchPage({ currentPage: value })
                    return
                }
    
                value = Math.floor($(elementIdName + ' .page-item.active a').html())
    
                // 上一页
                if (toggle === 'page-prev') {
                    if(typeof value === "number" && value > 1 && (value <= that.state.totalPageSize)) {
                        that.switchPage({ currentPage: (value - 1) })
                    }
                    return
                }
    
                // 下一页
                if(toggle === "page-next") {
                    if(typeof value === "number" && ((value + 1) <= that.state.totalPageSize)) {
                        that.switchPage({ currentPage: (value + 1) })
                    }
                    return
                }
    
                // 快速预览
                if(toggle === "page-left" || toggle === "page-right") {
                    if(toggle === "page-left") {
                        that.switchPage({ currentPage: value - 10 > 0 ? (value - 10) : 1 })
                    }else {
                        that.switchPage({ currentPage: value + 10 <= that.state.totalPageSize ? (value + 10) : that.state.totalPageSize })
                    }
                }
            })

            if(this.state.isShowInput) {
                // 跳转
                jump.click(function() {
                    var value = Math.floor(input.val())
                    if(typeof value === "number" && value <= that.state.totalPageSize) {
                        that.switchPage({ currentPage: value })
                    }
                })
        
                input.keyup(function(e) {
                    if(e.keyCode === 13) {
                        var value = Math.floor(input.val())
                        if(typeof value === "number" && value <= that.state.totalPageSize) {
                            that.switchPage({ currentPage: value })
                        }
                    }
                })
            }
    
            that.switchPage({ currentPage: this.state.currentPage })
        }
    
        Pagination.prototype.callback = function(data) {
            this.state.currentPage = data.currentPage

            if(data.isCb === false) {
                return false
            }

            if(this.state.cb && typeof this.state.cb === "function") {
                // 回调
                this.state.cb({
                    currentPage: data.currentPage,
                    pageSize: this.state.pageSize
                })
            }
        }
    
        return Pagination
    }())

    window.Pagination = Pagination
})()