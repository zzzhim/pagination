<template>
  <div class="pagination">
    <div class="pagination-body">
      <!-- 上一页 -->
      <nuxt-link :to="prevLink(currentPage, pageSize, 1)" >
        <div class="el-icon-arrow-left prev"></div>
      </nuxt-link>

      <ul class="pager">
        <template v-if="pageCount > 0">
          <li
            class="pager-item"
            :class="{ active: 1 === currentPage }"
            >
            <nuxt-link :to="link(1, pageSize)" class="link">{{ 1 }}</nuxt-link>
          </li>
        </template>

        <template v-if="showPrevMore">
          <li
            class="pager-item"
            @mouseenter="moreLeft=true"
            @mouseleave="moreLeft=false"
            >
            <nuxt-link
              :to="prevLink(currentPage, pageSize, 10)"
              class="link"
              :class="[ { 'el-icon-more': !moreLeft }, { 'el-icon-d-arrow-left': moreLeft }, ]"
              >
            </nuxt-link>
          </li>
        </template>

        <li
          class="pager-item"
          :class="{ active: item === currentPage }"
          v-for="(item, index) in list"
          :key="index"
          >
          <nuxt-link :to="link(item, pageSize)" class="link">{{ item }}</nuxt-link>
        </li>

        <template v-if="showNextMore">
          <li
            class="pager-item"
            @mouseenter="moreRight=true"
            @mouseleave="moreRight=false"
            >
            <nuxt-link
              :to="nextLink(currentPage, pageSize, 10)"
              class="link"
              :class="[ { 'el-icon-more': !moreRight }, { 'el-icon-d-arrow-right': moreRight }, ]"
              >
            </nuxt-link>
          </li>
        </template>

        <template v-if="pageCount > 1">
          <li
            class="pager-item"
            :class="{ active: pageCount === currentPage }"
            >
            <nuxt-link :to="link(pageCount, pageSize)" class="link">{{ pageCount }}</nuxt-link>
          </li>
        </template>
      </ul>

      <!-- 下一页 -->
      <nuxt-link :to="nextLink(currentPage, pageSize, 1)" >
        <div class="el-icon-arrow-right next"></div>
      </nuxt-link>

      <template>
        <div class="search">
          前往
          <el-input v-model="keyword" class="input" size="mini" @keyup.enter.native="handleSearch"></el-input>
          页

          <el-button type="primary" size="mini" class="btn" @click="handleSearch">跳转</el-button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "pagination",
  props: {
    total: [ Number ],
    currentPage: {
      type: [ Number ],
      default: 1,
    },
    pageSize: {
      type: [ Number ],
      default: 10,
    },
    pagerCount: {
      type: [ Number ],
      default: 7,
    },
    linkFun: Function,
  },
  data() {
    return {
      showPrevMore: false, // 上一页按钮
      showNextMore: false, // 下一页按钮
      moreLeft: false,
      moreRight: false,
      keyword: "",
    }
  },
  computed: {
    pageCount() {
      const num = Math.ceil(this.total / this.pageSize)

      return num
    },
    list() {
      const pagerCount = this.pagerCount
      const halfPagerCount = (pagerCount - 1) / 2

      const currentPage = Number(this.currentPage)
      const pageCount  = Number(this.pageCount)


      let showPrevMore = false
      let showNextMore = false

      if(pageCount > pagerCount) {
        if(currentPage > pagerCount - halfPagerCount) {
          showPrevMore = true
        }

        if(currentPage < pageCount - halfPagerCount) {
          showNextMore = true
        }
      }

      const array = []
      if (showPrevMore && !showNextMore) {
        const startPage = pageCount - (pagerCount - 2);
        for (let i = startPage; i < pageCount; i++) {
          array.push(i)
        }
      } else if (!showPrevMore && showNextMore) {
        for (let i = 2; i < pagerCount; i++) {
          array.push(i)
        }
      } else if (showPrevMore && showNextMore) {
        const offset = Math.floor(pagerCount / 2) - 1
        for (let i = currentPage - offset ; i <= currentPage + offset; i++) {
          array.push(i)
        }
      } else {
        for (let i = 2; i < pageCount; i++) {
          array.push(i)
        }
      }

      this.showPrevMore = showPrevMore
      this.showNextMore = showNextMore

      return array
    },
  },
  methods: {
    prevLink(currentPage, pageSize, num) {
      const page = currentPage - num

      if(page > 0) {
        return this.linkFun(page, pageSize)
      }else {
        return this.linkFun(1, pageSize)
      }
    },
    link(currentPage, pageSize) {
      return this.linkFun(currentPage, pageSize)
    },
    nextLink(currentPage, pageSize, num) {
      const page = currentPage + num

      if(page < this.pageCount) {
        return this.linkFun(page, pageSize)
      }else {
        return this.linkFun(this.pageCount, pageSize)
      }
    },
    handleSearch() {
      const keyword = Number(this.keyword)

      if(isNaN(keyword)) {
        return this.$message.warning("请输入数字！")
      }

      const pageSize = this.pageSize

      if(keyword > this.pageCount) {
        return this.$router.push(this.linkFun(this.pageCount, pageSize))
      }

      if(keyword < 1) {
        return this.$router.push(this.linkFun(1, pageSize))
      }

      this.$router.push(this.linkFun(keyword, pageSize))
    }
  },
}
</script>

<style lang="scss" scoped>
  .pagination {
    // width: 300px;
    height: 30px;
    font-size: 0px;

    &-body {
      .prev,
      .next {
        display: inline-block;
        width: 30px;
        height: 30px;
        vertical-align: middle;
        font-size: 12px;
        font-weight: bold;
        text-align: center;
        line-height: 30px;
        color: #7B7B7B;
        background-color: #f5f5f5;
        cursor: pointer;

        &:hover {
          color: #FFFFFF;
          background-color: #EB6EA5;
        }
      }

      .pager {
        display: inline-block;
        vertical-align: middle;

        &-item {
          display: inline-block;
          min-width: 30px;
          height: 30px;
          margin-left: 10px;
          vertical-align: middle;
          text-align: center;
          font-size: 12px;
          font-weight: bold;
          line-height: 30px;
          color: #7B7B7B;
          // border: 1px solid #D8D8D8;
          background-color: #f5f5f5;
          cursor: pointer;

          &.active {
            color: #FFFFFF;
            background-color: #EB6EA5;
            // border-color: #EB6EA5;

            .link {
              color: #FFFFFF;
            }
          }

          &:hover {
            color: #FFFFFF;
            background-color: #EB6EA5;

            .link {
              color: #FFFFFF;
            }
          }

          &.el-icon-d-arrow-left,
          &.el-icon-d-arrow-right {
            color: #EB6EA5;

            &:hover {
              color: #FFFFFF;
              background-color: #EB6EA5;
            }
          }

          .link {
            display: block;
            width: 100%;
            height: 100%;
            color: #7B7B7B;
            line-height: 30px;
          }
        }
      }

      .next {
        margin-left: 10px;
      }

      .search {
        display: inline-block;
        // width: 200px;
        height: 28px;
        font-size: 12px;
        margin-left: 20px;
        font-weight: normal;
        color: #7B7B7B;
        vertical-align: middle;

        .input {
          width: 50px;

          &::v-deep .el-input__inner {
            padding: 0px 5px;
            text-align: center;
          }
        }

        .btn {
          margin-left: 20px;
        }
      }
    }
  }
</style>