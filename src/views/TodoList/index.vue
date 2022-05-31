<template>

    <el-row>
        <el-col :xs="17" :sm="17" :md="17" :lg="17" :xl="17">
            <div class="left">
                <el-input v-model="state.input" placeholder='添加任务至"收集箱"，回车即可保存' @keyup.enter="addData"></el-input>
                <div class="todo">
                    <el-tree
                            :props="state.props"
                            :data="state.tableData"
                            default-expand-all
                            show-checkbox
                            @check-change="handleCheckChange"
                            @node-click="handleSelect"
                    >
                    </el-tree>
                </div>
                <div class="finished">
                    <el-tree
                            :props="state.props"
                            :data="state.finishedData"
                            show-checkbox
                            :default-checked-keys="state.defaultCheckedList"
                            node-key="id"
                            @node-click="handleSelect"
                    >
                    </el-tree>
                </div>


            </div>
        </el-col>
        <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7">
            <div class="detail">
                <div class="headline-div">
                    <div class="headline">
                        <!--<el-icon color="#AEAEAE">-->
                        <CircleCheckFilled style="width: 1.2em; height: 1.2em; margin-right: 20px; color: #AEAEAE"/>
                        <!--</el-icon>-->
                        <Calendar style="width: 1.2em; height: 1.2em; margin-right: 8px; color: #848484"/>

                    </div>
                </div>
                <!--<div class="title-div"><span class="title" contenteditable="true">{{ targetData.title }}</span>-->
                <!--</div>-->
                <div class="title-div">
                    <el-input class="title" v-model="targetData.title" placeholder="标题"></el-input>
                </div>
                <!--<div class="descr-div"><span class="descr" contenteditable="true"-->
                <!--title="描述">{{ targetData.desc }}</span></div>-->
                <div class="descr-div">
                    <el-input class="descr" type="textarea" v-model="targetData.desc" rows=25
                              placeholder="描述">{{ targetData.desc }}
                    </el-input>
                </div>
            </div>
        </el-col>

    </el-row>

</template>

<script>
    import {reactive, onMounted, watch} from "vue";
    import {ElMessage} from "element-plus";
    import {CircleCheckFilled, Calendar} from '@element-plus/icons'
    import req from "../../http/http";

    export default {
        name: "index",
        components: {
            CircleCheckFilled,
            Calendar
        },
        setup() {

            const targetData = reactive({
                id: "",
                title: "",
                desc: ""
            });

            const state = reactive({
                input: "",
                targetData: {
                    id: "",
                    title: "",
                    desc: ""
                },

                createData: {
                    title: " ",
                    desc: " "
                },
                tableData: [],
                finishedData: [],
                defaultCheckedList: [],
                props: {
                    label: 'title',
                    children: 'zones'
                },
            });

            function getData(status = 0) {
                req(
                    "get",
                    "todo_list/?status=" + status
                ).then((response) => {
                    state.tableData = response;
                    // if (state.tableData.length > 0) {
                    //     targetData.id = state.tableData[0].id;
                    //     targetData.title = state.tableData[0].title;
                    //     targetData.desc = state.tableData[0].desc;
                    // }
                });
            }

            function getFinishedData(status = 2) {
                req(
                    "get",
                    "todo_list/?status=" + status
                ).then((response) => {
                    state.finishedData = response;
                    state.defaultCheckedList = [];
                    for (const index in response) {
                        state.defaultCheckedList.push(response[index].id)
                    }
                });
            }

            function getAllData() {
                getData();
                getFinishedData();
            }

            function addData() {
                if (state.input === "" || !state.input) {
                    return
                } else {
                    state.createData.title = state.input
                }
                req(
                    "post",
                    "todo_list/",
                    JSON.stringify(state.createData)
                ).then(() => {
                    ElMessage.success({
                        message: "添加代办事项成功",
                        type: "success",
                    });
                    state.input = "";
                    getData();
                });
            }

            function updateData(data) {
                req(
                    "put",
                    "todo_list/" + data.id,
                    JSON.stringify(data)
                ).then((response) => {
                    state.finishedData = response.finishedList;
                    state.tableData = response.doingList;
                    state.defaultCheckedList = [];
                    for (const index in state.finishedData) {
                        state.defaultCheckedList.push(state.finishedData[index].id)
                    }
                    // ElMessage.success({
                    //     message: "更新待办事项成功",
                    //     type: "success",
                    // });
                    state.input = "";
                    // getAllData();
                });
            }

            function handleCheckChange(data, checked) {
                if (checked) {
                    data.status = 2;
                } else {
                    data.status = 0;
                }
                updateData(data);

            }

            function handleSelect(data) {
                getAllData();
                targetData.id = data.id;
                targetData.title = data.title;
                targetData.desc = data.desc;
            }

            watch(targetData, (newValue) => {
                updateData(newValue)
            }, {deep: true});

            onMounted(() => {
                getAllData()
            });

            return {
                targetData,
                state,
                getData,
                addData,
                handleCheckChange,
                handleSelect
            };
        },
    };
</script>

<style lang="scss" scoped>
    /*.grid-content {*/
    /*padding: 10px;*/
    /*}*/

    .el-row {
        height: 97%;
        /*min-height: 100vh;*/
        border: 1px;
        border-style: solid;
        border-color: rgba(25, 25, 25, 0.05);

        .el-col {
            height: 100%;
                            border-left-width: 1px;
                border-style: solid;
                border-color: rgba(25, 25, 25, 0.05);

            .detail {
                height: 100%;


                .headline-div {
                    border-bottom-width: 1px;
                    border-style: solid;
                    border-color: rgba(25, 25, 25, 0.05);

                    .headline {
                        margin: 15px;
                    }
                }

                .title-div {
                    margin-left: 15px;
                    margin-top: 10px;

                    .title {
                        :deep(.el-input__inner) {
                            padding: 0;
                            border: 0;
                            font-size: 19px;
                            font-family: apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Microsoft Yahei, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
                            font-weight: 700;
                            outline: none;
                        }

                    }

                    .el-input {
                        border: 0;
                    }
                }

                .descr-div {
                    margin: 0 15px;

                    :deep(.el-textarea__inner) {
                        resize: none; // 去掉下拉框
                        padding: 0;
                        border: 0;
                        font-family: apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, "Microsoft Yahei", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
                        font-size: 14px;
                        font-weight: 400;
                        line-height: 21px;
                        width: 100%;
                        height: 100%;
                        display: inline-block;
                        outline: none;
                        color: gray;
                    }
                }
            }
        }
    }

    .left {
        .el-input {
            margin-left: 20px;
            margin-top: 20px;
            margin-bottom: 10px;
            width: 97%;

            :deep(.el-input__inner) {
                background-color: rgba(25, 25, 25, 0.08);
            }
        }
    }


    .el-tree {
        :deep(.el-tree-node) {
            padding: 7px 0;


            .el-checkbox__inner {
                /*width: 20px;*/
                /*height: 20px;*/
                margin: 0 10px;
            }

            .el-tree-node__label {
                font-size: 15px;
                /*border-bottom: 1px solid gray;*/

            }

        }
    }


    .todo {

    }

    .finished {
        .el-tree {
            color: rgb(0, 0, 0, 0.3);

            :deep(.el-tree-node) {
                padding: 7px 0;


                .el-checkbox__inner {
                    opacity: 0.3;
                    -webkit-filter: grayscale(1);
                }
            }
        }

    }
</style>