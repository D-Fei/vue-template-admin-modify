<template>
  <div class="app-container">
    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="Role ID" width="220">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Role Name" width="220">
        <template slot-scope="scope">
          {{ scope.row.role }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations" width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">Edit</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit Role':'New Role'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="role.name" placeholder="Role Name" />
        </el-form-item>
        <el-form-item label="Menus">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="menusData"
            :props="defaultProps"
            show-checkbox
            node-key="path"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button type="primary" @click="confirmRole">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { getMenus, getRoles, addRole, deleteRole, updateRole } from '@/api/role'

const defaultRole = {
  id: '',
  role: '',
  menus: []
}

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      menus: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        label: 'title',
        children: 'children'
      }
    }
  },
  computed: {
    menusData() {
      return this.menus
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    this.getMenus()
    this.getRoles()
  },
  methods: {
    async getMenus() {
      const res = await getMenus()
      //***************  add  test  *****
      // console.log(res.data)
      this.serviceRoutes = res.data
      // console.log(this.serviceRoutes)
      this.menus = this.generateRoutes(res.data)
    },
    async getRoles() {
      const res = await getRoles()
      this.rolesList = res.data
    },
    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(menus, basePath = '/') {
      const res = []
      // 
      console.log("menus",menus)

      for (let menu of menus) {
//    ***********add test
        console.log("menu",menu)
        console.log("menus",menus)
        console.log("menu.hidden",menu.hidden)
        // skip some route
        if (menu.hidden) { continue }
//  ************add test
        if (!menu.children) {continue}
        console.log("menu.children",menu.children)
        // *************** 目前问题
        const onlyOneShowingChild = this.onlyOneShowingChild(menu.children, menu)

        if (menu.children && onlyOneShowingChild && !menu.alwaysShow) {
          menu = onlyOneShowingChild
        }
        console.log("menu",menu)
        console.log("onlyOneShowingChild",onlyOneShowingChild)
// **********add  test
        console.log("menu.path",menu.path)
        const data = {
          path: path.resolve(basePath, menu.path),
          title: menu.name
        }
        console.log("data.path",data.path)

        // recursive child routes
        if (menu.children) {
          data.children = this.generateRoutes(menu.children, data.path)
        }
        res.push(data)
        console.log(res)
      }
      return res
    },
    generateArr(menus) {
      let data = []
      menus.forEach(menu => {
        data.push(menu)
        if (menu.children) {
          const temp = this.generateArr(menu.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
      this.$nextTick(() => {
        const menus = this.generateRoutes(this.role.menus)
        this.$refs.tree.setCheckedNodes(this.generateArr(menus))
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
      })
    },
    generateTree(menus, basePath = '/', checkedKeys) {
      const res = []

      for (const menu of menus) {
        const menuPath = path.resolve(basePath, menu.path)

        // recursive child routes
        if (menu.children) {
          menu.children = this.generateTree(menu.children, menuPath, checkedKeys)
        }

        if (checkedKeys.includes(menuPath) || (menu.children && menu.children.length >= 1)) {
          res.push(menu)
        }
      }
      return res
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'

      const checkedKeys = this.$refs.tree.getCheckedKeys()
      this.role.menus = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)

      if (isEdit) {
        await updateRole(this.role)
        for (let index = 0; index < this.rolesList.length; index++) {
          if (this.rolesList[index].id === this.role.id) {
            this.rolesList.splice(index, 1, Object.assign({}, this.role))
            break
          }
        }
      } else {
        const { data } = await addRole(this.role)
        this.role.id = data.id
        this.rolesList.push(this.role)
      }

      const { id, role } = this.role
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Role ID: ${id}</div>
            <div>Role Name: ${role}</div>
          `,
        type: 'success'
      })
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      // console.log("children",children)
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)
      // console.log("showingChildren",showingChildren)
      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>