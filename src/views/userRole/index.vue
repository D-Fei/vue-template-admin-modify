<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-top:30px;"
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="USERNAME" width="300" align="center">
        <template slot-scope="scope">
          {{ scope.row.userName }}
        </template>
      </el-table-column>
      <el-table-column label="OPERATIONS" width="300" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">EditRole</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit User':'New User'">
      <el-form :model="user" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="user.userName" placeholder="User Name" />
        </el-form-item>
        <!-- add -->
        <el-form-item label="Menus">
          <el-tree
            ref="tree"
            :load="loadNode"
            lazy
            :props="defaultProps"
            show-checkbox
            @check-change="handleCheckChange"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button type="primary" @click="confirmUser">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList, addUser, deleteUser, updateUser} from '@/api/user'
import { getRoles } from '@/api/role'
import {deepClone} from '@/utils'


const defaultUser = {
  id: '',
  userName: '',
  password: '',
//   add role列表
  roles: []
}

export default {
  inject: ['reload'],
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      user: Object.assign({}, defaultUser),
      dialogVisible: false,
      dialogType: 'new',
      //add
      checkStrictly: false,
      defaultProps: {
        label: 'name',
        children: 'zones'
      },
      count: 1
    }
  },
  //add
  computed: {
    rolesData() {
      return this.roles
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // async getRoles() {
    //   const res = await getRoles()
    //   console.log(res)
    //   this.roles = res.data
    // },
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data
        this.listLoading = false
      })
      getRoles().then(response =>{
          console.log(response.data)
          this.list.roles = response.data
      })
    },
    handleCheckChange(data, checked, indeterminate) {
        console.log("data:",data,"checked", checked, "indeterminate",indeterminate);
      },
    handleNodeClick(data) {
        console.log(data);
    },
    loadNode(node, resolve) {
        console.log("node",node)
        console.log("node.level",node.level)
        if (node.level === 0) {
          let list = []
          this.list.roles.forEach(element => {
              let data
              data = { name: element.role }
              list.push(data)
          });
        //   const newLocal='region2'
        //   return resolve([{ name: 'region1' }, { name: newLocal }]);
           return resolve(list)
        }
        if (node.level > 3) return resolve([]);

        var hasChild = false;
        // if (node.data.name === 'region1') {
        //   hasChild = true;
        // } else if (node.data.name === 'region2') {
        //   hasChild = false;
        // } else {
        //   hasChild = Math.random() > 0.5;
        // }

        setTimeout(() => {
          var data;
          if (hasChild) {
            data = [{
              name: 'zone' + this.count++
            }, {
              name: 'zone' + this.count++
            }];
          } else {
            data = [];
          }

          resolve(data);
        }, 500);
    },
    // loadNode(node,resolve){
    //     let list = []
    //     this.list.roles.forEach(element => {
    //         console.log(element.role)
    //         let data = [{name :element.role}]
    //         list.push(data)
    //     });
    //     return resolve(list)
    // },
    // handleCheckChange(data, checked, indeterminate) {
    //     console.log(data, checked, indeterminate);
    //   },
    //   handleNodeClick(data) {
    //     console.log(data);
    //   },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.user = deepClone(scope.row)
      //add
      this.checkStrictly = true
    //   console.log(this.list)
    //   console.log(this.roles)
    },
    async confirmUser() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        await updateUser(this.user)
        this.reload()
      } else {
        const { data } = await addUser(this.user)
        this.user.id = data.id
        this.reload()
      }
      // location.reload()
      const { password, id, userName } = this.user
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>User ID: ${id}</div>
            <div>User Name: ${userName}</div>
            <div>Password: ${password}</div>
          `,
        type: 'success'
      })
    },
  }
}
</script>
