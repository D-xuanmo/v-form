<template>
  <div class="v-form__upload" @click="__eventHandler('click', formModel)">
    <ul class="v-form__upload-preview">
      <li
        v-for="(item, index) in value"
        :key="index"
        class="v-form__upload-preview-item"
      >
        <template>
          <img :src="item[fileUrlKey]" />
          <!-- <p v-else class="v-form__upload-preview-text">{{ item[fileUrlKey] }}</p> -->
        </template>

        <!-- 上传进度开始 -->
        <div v-if="item.loading" class="v-form__upload-preview-mask">
          <template>
            <i
              v-if="item.loadingText === '上传失败'"
              class="van-icon van-icon-warning-o van-uploader__mask-icon"
            ></i>
            <div
              v-else
              class="van-loading van-loading--circular van-uploader__loading"
            >
              <span class="van-loading__spinner van-loading__spinner--circular">
                <svg viewBox="25 25 50 50" class="van-loading__circular">
                  <circle cx="50" cy="50" r="20" fill="none"></circle>
                </svg>
              </span>
            </div>
          </template>
          <span class="v-form__upload-loading-text">{{ item.loadingText }}</span>
        </div>
        <!-- 上传进度结束 -->

        <!-- 删除按钮 -->
        <span
          v-if="!disabled"
          class="van-icon van-icon-clear van-uploader__preview-delete"
          @click="_removeFile(index)"
        />
      </li>
      <li class="v-form__upload-input">
        <input
          type="file"
          :accept="formModel.rules.accept"
          :multiple="formModel.rules.multiple"
          :disabled="disabled"
          @change="_selectFile"
        />
        <i class="van-icon van-icon-photograph"></i>
      </li>
    </ul>
  </div>
</template>

<script>
import formItemBase from '../mixins/formItemBase'
import request from '../utils/request'
import { isObject, isImageUrl } from '@xuanmo/javascript-utils'
export default {
  name: 'VUpload',

  mixins: [formItemBase],

  props: {
    value: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      files: [],
      previewList: []
    }
  },

  computed: {
    multiple() {
      return this.formModel.rules.multiple || false
    },

    limit() {
      return this.formModel.rules.limit || 0
    },

    fileUrlKey() {
      return (
        (this.formModel.rules.props && this.formModel.rules.props.url) || 'url'
      )
    },

    loadingText() {
      return this.formModel.rules.loadingText || '上传中'
    },

    uploadErrorText() {
      return this.formModel.rules.uploadErrorText || '上传失败'
    }
  },

  watch: {
    previewList: {
      deep: true,
      handler(val) {
        this.e__input(val)
      }
    }
  },

  methods: {
    _isImg(url) {
      return isImageUrl(url)
    },

    _beforeUpload() {
      // 如果没有上传地址结束函数后续操作
      if (!this.formModel.rules.action) return false

      // 多选为false时只能选择一个文件
      if (!this.multiple && this.value.length >= 1) {
        this.__eventHandler('file-exceed', this.value)
        return false
      }

      // 为0时不限制个数
      if (this.limit === 0) return true

      // 判断是否超过上传最大个数
      if (this.multiple && this.value.length >= this.limit) {
        this.__eventHandler('file-exceed', this.value)
        return false
      }
    },

    _selectFile({ target }) {
      this.files = Array.from(target.files).map((file, index) => ({
        file,
        index: this.value.length + index
      }))

      this.__eventHandler('file-change', this.files)

      this._handlerUpload()
    },

    // 文件转本地预览
    _fileToBlob(file) {
      return URL.createObjectURL(file)
    },

    // 删除文件
    _removeFile(index) {
      this.__eventHandler('file-remove', {
        removed: this.previewList.splice(index, 1),
        list: this.previewList
      })
    },

    // 执行上传操作
    async _handlerUpload() {
      if (!this._beforeUpload()) return

      this.previewList = [
        ...this.value,
        ...this.files.map(({ file, index }) => ({
          [this.fileUrlKey]: this._fileToBlob(file),
          loading: true,
          loadingText: this.loadingText,
          index
        }))
      ]

      // 单个上传文件
      for (let i = 0; i < this.files.length; i++) {
        await this._upload(this.files[i].file, this.files[i].index)
      }
    },

    // 文件上传
    async _upload(file, index) {
      const _index = this.previewList.findIndex(({ index: i }) => i === index)
      const formData = new FormData()
      formData.append(this.formModel.rules.name || 'file', file)

      // 遍历上传附加数据
      if (isObject(this.formModel.rules.data)) {
        for (const [key, val] of Object.entries(this.formModel.rules.data)) {
          formData.append(key, val)
        }
      }

      // 上传文件之前
      this.__eventHandler('file-before-upload', this.files)

      try {
        let response = await request({
          url: this.formModel.rules.action,
          method: 'POST',
          dataType: 'json',
          data: formData,
          headers: this.formModel.rules.headers
        })

        // 接收自定义处理数据
        if (typeof this.formModel.rules.onSuccess === 'function') {
          const _res = this.formModel.rules.onSuccess(response)
          response = _res || response
        }

        const [{ path: _removed }] = this.previewList.splice(_index, 1, response)

        // 释放本地预览的对象，防止继续停留在内存中
        URL.revokeObjectURL(_removed)

        this.__eventHandler('file-success', {
          response,
          list: this.previewList
        })

        return Promise.resolve()
      } catch ({ status, statusText }) {
        // 上传失败
        this.previewList[_index].loadingText = this.uploadErrorText
        this.__eventHandler('file-error', {
          status,
          statusText
        })
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject({
          status,
          statusText
        })
      }
    }
  }
}
</script>
