<template>
  <div class="editor_main">
    <el-form>
      <!-- 标题作者 -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="标题:" label-width="80px">
            <el-input
              v-model="notice.title"
              placeholder="请输入标题"
              type="textarea"
              autosize
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-form-item label="作者:" label-width="80px">
            <el-input
              placeholder="请输入作者"
              autosize
              clearable
              v-model="notice.author"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 简介时间 -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="简介:" label-width="80px">
            <el-input
              v-model="notice.description"
              placeholder="简介"
              type="textarea"
              autosize
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-form-item label="时间:" label-width="80px">
            <el-date-picker
              v-model="notice.date"
              type="date"
              placeholder="请选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 资源地址和类型 -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="资源地址:" label-width="80px">
            <el-input
              placeholder="请输入资源地址"
              autosize
              clearable
              v-model="notice.mediaUrl"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-form-item label="资源类型:" label-width="80px">
            <el-select
              v-model="notice.mediaType"
              clearable
              placeholder="请选择"
            >
              <el-option value="image"> </el-option>
              <el-option value="video"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 资源上传和资源列表 -->
      <el-row>
        <el-col :span="12">
          <div>
            <input
              @change="upLoad"
              type="file"
              style="display: none"
              ref="file_upload"
            />
            <el-button
              @click="selectFile"
              type="primary"
              :loading="isUpload"
              round
              style="margin-right: 10px"
              >上传文件<i class="el-icon-upload el-icon--right"></i
            ></el-button>
            <span>{{ upload_message }}</span>
          </div>

          <!-- <h5>只能上传图片文件，且不超过10M</h5> -->
        </el-col>
        <el-col :span="3" :offset="2">
          <el-button type="success" @click="openSource" round>{{
            source ? "关闭资源列表" : "打开资源列表"
          }}</el-button>
        </el-col>
        <el-col :span="3">
          <el-button
            type="danger"
            @click="save"
            icon="el-icon-folder-checked"
            round
            >保存</el-button
          >
        </el-col>
      </el-row>
      <!-- 资源列表 -->
      <div v-show="source">
        <div class="editor_imageList">
          <div
            v-for="(image, index) in imageList"
            :key="index"
            class="imagelist_item"
            @mouseover="handleImage(index)"
            @mouseleave="handleLeaveImage"
          >
            <el-card :body-style="{ padding: '0px' }" shadow="hover">
              <div>
                <img
                  v-if="image.fileType === 'image'"
                  :src="
                    'http://82.157.179.123:8080/file/getImage?fileName=' +
                    image.fileName
                  "
                  class="editor_images"
                />
                <video
                  v-else
                  muted
                  autoplay
                  loop
                  :src="
                    'http://82.157.179.123:8080/file/getVideo?fileName=' +
                    image.fileName
                  "
                  class="editor_images"
                />
              </div>

              <transition name="fade">
                <!-- v-show="currentIndex === index" -->
                <div class="image_bottom">
                  <div class="image_name">
                    {{ image.fileName }}
                  </div>
                  <div :span="6">
                    <el-link
                      type="primary"
                      @click="use(image)"
                      style="display: inline-block; margin-left: 5px"
                      >使用</el-link
                    >
                    <el-link
                      type="danger"
                      @click="deleteImage(image)"
                      style="display: inline-block; margin-left: 10px"
                      >删除</el-link
                    >
                  </div>
                </div>
              </transition>
            </el-card>
          </div>
        </div>
      </div>

      <el-divider></el-divider>
      <!-- 如果出现图片显示异常加上style="display:block;width:100%" -->
      <vue-tinymce v-model="notice.content" :setting="setting" />
      <el-divider></el-divider>
      <div v-html="notice.content" class="moreInfo"></div>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "edit",
  components: {},
  data() {
    return {
      setting: {
        menubar: true,
        toolbar:
          "searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent blockquote undo redo removeformat subscript superscript code codesample help', 'hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons charmap forecolor backcolor fullpage fullscreen",
        toolbar_drawer: "sliding",
        quickbars_selection_toolbar:
          "removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor",
        plugins:
          "advlist anchor autolink autoresize autosave charmap code codesample directionality emoticons fullpage fullscreen help hr image imagetools insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textpattern visualblocks visualchars wordcount",
        language: "zh_CN", //本地化设置
        height: "auto",
      },
      media: {},
      source: false,
      imageList: [],
      currentIndex: -1,
      isUpload: false,
      upload_message: "只能上传图片和视频文件，最大10M",
    };
  },

  computed: {
    ...mapGetters([
      //当前操作的数据库表
      "table",
      //当前操作的表内子项的类别
      "kind",
      //是否在进行编辑
      "isEdit",
      //正在编辑的内容
      "notice",
    ]),
  },
  methods: {
    //保存文章
    save() {
      // console.log("修改数据", this.notice);
      let url = this.table+"/"+"update"+this.table+"Notice";
      this.$axios
        .get(url, {
          params: {
            id: this.notice.id,
            kind: this.kind,
            date: this.notice.date,
            author: this.notice.author,
            title: this.notice.title,
            description: this.notice.description,
            status: 0,
            content: this.notice.content,
            mediaType: this.notice.mediaType,
            mediaUrl: this.notice.mediaUrl,
          },
        })
        .then((res) => {
          if (res.data === 1) {
            this.$message.success("保存成功");
          } else {
            this.$$message.error("保存失败");
          }
          console.log(res);
        });

      this.$store.commit("changeEditStatus", false);
      this.$emit("refresh");
    },
    // 资源列表的开关
    openSource() {
      if (this.source === false) {
        this.source = true;
        this.getAllImages();
      } else {
        this.source = false;
      }
    },
    selectFile() {
      this.$refs.file_upload.click();
    },
    //资源上传功能
    upLoad(e) {
      if (e.target.files.length === 0) return;
      let file = e.target.files[0];
      let type = file.type;
      // 对文件格式进行限制，只能是图片或者视频
      if (!type.startsWith("image") && !type.startsWith("video")) {
        console.log(type);
        this.$message.error("文件格式错误");
        return;
      }
      // 上传部分
      // console.log(file);
      let url = "http://82.157.179.123:8080/file/fileUpload"; //你的后台上传地址
      let data = new FormData();
      data.append("uploadFile", file);
      this.isUpload = true;

      this.upload_message =
        file.name + " " + (file.size / (1024 * 1024)).toFixed(2) + "MB";
      setTimeout(() => {
        this.$axios({
          url,
          method: "post",
          data,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          //原生获取上传进度的事件
          onUploadProgress: function (progressEvent) {
            let complete =
              (((progressEvent.loaded / progressEvent.total) * 100) | 0) + "%";
            // console.log("上传 " + complete);
          },
        })
          .then((res) => {
            if (res.data === 0) {
              this.$message.error("上传失败");
            } else if (res.data === 1) {
              this.$message.success("上传成功");
              this.isUpload = false;
              this.source = true;
              this.upload_message = "只能上传图片和视频文件，最大10M";
              if (this.source) {
                this.getAllImages();
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }, 2000);
    },
    handleImage(e) {
      // console.log(e);
      this.currentIndex = e;
    },
    handleLeaveImage() {
      this.currentIndex = -1;
    },
    getAllImages() {
      this.$axios.get("file/queryAllFiles").then((res) => {
        console.log(res.data);
        let baseUrl = "http://82.157.179.123:8080/file/getImage?fileName=";
        this.imageList = res.data;
      });
    },
    getImages(imageName) {
      this.$axios
        .get("file/getImage", {
          params: {
            fileName: imageName,
          },
        })
        .then((res) => {
          console.log(res);
          this.image = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    use(item) {
      this.notice.mediaType = item.fileType;
      if (item.fileType === "image") {
        this.notice.mediaUrl =
          "http://82.157.179.123:8080/file/getImage?fileName=" + item.fileName;
      } else {
        this.notice.mediaUrl =
          "http://82.157.179.123:8080/file/getVideo?fileName=" + item.fileName;
      }

      this.$message.success("媒体资源修改成功");
    },
    deleteImage(item) {
      this.$axios
        .get("file/deleteFile", {
          params: {
            id: item.id,
          },
        })
        .then((res) => {
          if (res.data === 1) {
            this.$message.success("删除成功");
            this.getAllImages();
          } else {
            this.$message.error("删除失败");
          }
        })
        .catch((err) => {
          this.$message.error("删除失败");
        });
    },
  },
  mounted() {
    console.log("我在editor", this.kind, this.table);
  },

  created() {},
};
</script>

<style scoped>
.demo-form-inline {
  font-weight: bold;
  font-family: Arial, sans-serif;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 10px;
}

.editor_main {
  margin: 20px;
}

/* 图片列表 */
.editor_imageList {
  /* 伸缩容器 */
  display: flex;
  /* grid-gap: 30px 20px;
  grid-template-columns: repeat(
    auto-fill,
    minmax(-webkit-calc(50% - 20px), 1fr)
  );
  grid-template-columns: repeat(auto-fill, minmax(calc(50% - 20px), 1fr));
  grid-auto-flow: dense; */
  /* 换行  */
  flex-wrap: wrap;
  /* 主轴对齐方式 */
  /* justify-content: space-around; */
  background: rgb(64 158 255 / 15%);
  align-items: flex-start;
  margin-top: 20px;
  /* max-height: 800px;
  overflow:auto */
}

/* 当经过图片是的特效 */
.fade-enter-active {
  animation: play 2s;
}
.fade-leave-active {
  animation: play 2s reverse;
}
.fade-enter, .fade-leave-to /* .fade-leave-active, 2.1.8 版本以下 */ {
  opacity: 0;
}

@keyframes play {
  0% {
    /* height: 0px; */
    opacity: 0;
  }
  100% {
    /* height: 20px; */
    opacity: 1;
  }
}

/* 装载图片的容器 */
.imagelist_item {
  margin: 10px;
  /* transition-duration: 1s; */
}

.el-card {
  border: none;
}

/* 图片 */
.editor_images {
  max-width: 400px;
  max-height: 400px;
  transition: all 0.25s ease-in-out;
  backface-visibility: hidden;
}

.editor_images:hover {
  -webkit-transform: scale(1.05);
  -ms-transform: scale(1.05);
  transform: scale(1.05);
}

/* 图片下方的容器 */
.image_bottom {
  padding: 5px;
  display: flex;
  justify-content: space-around;
  transition-duration: 1s;
}

/* 图片的名字*/
.image_name {
  text-align: center;
  /* line-height: 38px; */
  font-size: unset;
  font-weight: bolder;
  font-family: sans-serif;
}

.moreInfo {
  padding: 0;
  margin-bottom: 80px;
}
</style>
