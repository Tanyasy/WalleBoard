<template>
  <el-button class="add-button" type="primary" @click="showAddDialog">新增任务</el-button>
  <div class="table">
    <el-table
        stripe
        :data="state.tableData"
        :header-cell-style="header_style"
        style="width: 100%"
    >

      <el-table-column
          prop="id"
          label="任务id"
          width="200"
      >
        <template #default="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column
          prop="name"
          label="描述"
          width="400"
      >
        <template #default="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
          prop="next_time"
          label="下次执行时间"
          width="250"
          show-overflow-tooltip
      >
        <template #default="scope">
          {{ scope.row.next_time }}
        </template>
      </el-table-column>
      <el-table-column
          prop="status"
          label="状态"

      >
        <template #default="scope">
<!--          {{ scope.row.status }}-->
<!--          <div class="card-panel-icon-wrapper icon-shopping">-->
          <svg-icon
            :icon-class="scope.row.status"
            class-name="card-panel-icon"
          />
<!--        </div>-->

        </template>
      </el-table-column>
      <el-table-column
          align="right"
          fixed="right"
          label="操作"
          width="180"
      >
        <template #default="scope" >
          <el-popconfirm
              :title="confirmTitle(scope.row)"
              @confirm="addItem(scope.row.id)"
              v-if="scope.row.next_time !== '暂停中...'"
          >
            <template #reference>
          <el-button
              size="small"
              type="primary"

          ><el-icon><caret-right /></el-icon>立即执行
          </el-button>
            </template>
          </el-popconfirm>


          <el-popconfirm
              title="确定暂停吗？"
              @confirm="deleteItem(scope.row)"
              v-if="scope.row.next_time !== '暂停中...'"
          >
            <template #reference>
              <el-button
                  size="small"
                  type="danger"
              >暂停
              </el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm
              title="确定恢复吗？"
              @confirm="updateItem(scope.row)"
              v-else
          >
            <template #reference>
              <el-button
                  size="small"
                  type="primary"
              >恢复
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
        :title="state.title"
        v-model="editDialogVisible"
        width="32%"

        center>
      <div class="edit-name">
        <span>角色名称: </span>
        <el-input
            prefix-icon="User"
            v-model="state.editItem.name">
        </el-input>
      </div>
      <el-transfer
          v-model="state.itemIDList"
          :props="{
                      key: 'id',
                      label: 'name'
                    }"
          :data="state.itemList"/>
      <template #footer>
                <span class="dialog-footer">
                  <el-button @click="editDialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="handleSubmit">确 定</el-button>
                </span>
      </template>

    </el-dialog>

    <div class="page">
      <el-pagination
          background
          :page-sizes="state.pageArray"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          v-model:currentPage="state.currentPage"
          :total="state.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted} from "vue";
import {ElMessage} from "element-plus";
import req from "../../http/http";
import {header_style} from "../../utils/common"

const currentPage = ref(0);
const limit = ref(10);
const visible = ref(false);
const editDialogVisible = ref(false);
const state = reactive({
  itemList: [],
  itemIDList: [],
  tableData: [],
  value: "",
  title: "新增角色",

  editItem: {},
  currentPage: 0,
  limit: 10,
  total: 0,
  pageArray: [5, 10, 20, 50, 100],
});

function getItems() {
  req(
      "get",
      "jobs/?page=" + state.currentPage + "&limit=" + state.limit
  ).then((response) => {
    state.tableData = response.data
    state.total = response.count
    editDialogVisible.value = false
  });
}

function addItem(job_id) {
  req(
      "post",
      "jobs",
      JSON.stringify({job_id: job_id})
  ).then((response) => {
    ElMessage.success({
      message: response.msg,
      type: "success",
    });
    getItems();
  });
}

function updateItem(item) {
  req(
      "put",
      "jobs/" + item.id
  ).then((response) => {
    ElMessage.success({
      message: response.msg,
      type: "success",
    });
    getItems();
  });
}

function deleteItem(item) {
  req("delete", "jobs/" + item.id).then((response) => {
    ElMessage.success({
      message: response.msg,
      type: "success",
    });
    getItems();
  });
}

function getPermission() {
  req("get", "permission").then((response) => {
    state.itemList = response.data
  });
}

function handleSubmit() {
  state.editItem.permissions = state.itemIDList
  if (state.title === "新增角色") {
    addItem()
  } else {
    updateItem()
  }
}

function getIds(itemList) {
  let result = []
  itemList.forEach((item) => {
    result.push(item.id)
  })
  return result
}

function showAddDialog() {
  state.title = "新增角色"
  state.editItem.id = ""
  state.editItem.name = ""
  state.editItem.codename = ""
  state.itemIDList = []
  editDialogVisible.value = true
}

function showEditDialog(item) {
  state.title = "编辑角色"
  state.editItem.id = item.id
  state.editItem.name = item.name
  state.editItem.codename = item.codename
  state.itemIDList = getIds(item.permissions)

  editDialogVisible.value = true
}


const dateFormat = (dateStr) => {
  return dateStr.replace("T", " ");
};

const confirmTitle = (item) => {
  return "确定执行任务" + item.name + "吗？";
};


const handleSizeChange = (size) => {
  state.limit = size;
  getItems();
};

const handleCurrentChange = (page) => {
  if (page) {
    state.currentPage = page;
    getItems();
  }
};



onMounted(() => {
  getItems();
  getPermission();
});
</script>

<style lang="scss" scoped>
.table {
  font: 15px/1.5 tahoma, arial, \5b8b\4f53;
  margin: 10px 20px;

  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  /*box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);*/
  /*height: 680px;*/
  padding: 10px;
  /*background-color: rgba(0, 0, 0, .1);*/
  .page {
    margin-left: 50%;
    margin-top: 20px;
  }

  .card-panel-icon {
      float: left;
      font-size: 25px;
  }

  .el-dialog__body {
    span {
      margin-right: 10px;
    }

    .el-input {
      width: 75%;
    }

    .edit-name {
      margin-bottom: 10px;

    }
  }
}

.add-button {
  margin-left: 20px;
}
</style>