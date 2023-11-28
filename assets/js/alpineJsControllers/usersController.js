document.addEventListener('alpine:init', () => {
    Alpine.data('usersData', ()=>({
            mainUsers: [],
            users: [],
            pageUsers: [],
            isLoading: false,
            showAdModal: false,
            pageCount: 1,
            itemsCount: 4,
            currentPage: 1,
            searchChar:"",
            newUserInfo:{
                name:"",
                username:"",
                email:"",
                address:"",
            },
            userIdToEdit: null,
            getUsers(){
                this.isLoading = true
                axios.get("https://jsonplaceholder.typicode.com/users").then((res)=>{
                this.mainUsers = res.data
                this.users = res.data
                this.pagination()
                }).finally(()=>{
                    this.isLoading = false
                })
            },
            pagination(){
                this.pageCount = Math.ceil(this.users.length / this.itemsCount) // 10/4 = 3
                let start = (this.currentPage * this.itemsCount) - this.itemsCount
                let end = this.currentPage * this.itemsCount
                this.pageUsers = this.users.slice(start,end)
            },
            nextPage(){
                this.currentPage++
                if (this.currentPage > this.pageCount) {
                    this.currentPage = this.pageCount
                }
                this.pagination()
            },
            prevPage(){
                this.currentPage--
                if (this.currentPage < 1) {
                    this.currentPage = 1
                }
                this.pagination()
            },
            handleChangeItemsCount(value){
                this.currentPage = 1
                if (value < 1) this.itemsCount = 1
                if (value > this.users.length) this.itemsCount = this.users.length
            },
            handleSearch(value){
                this.users = this.mainUsers.filter(user=>(user.name.includes(value) || user.username.includes(value) || user.email.includes(value)))
                this.currentPage = 1;
                this.pagination()
            },
            handleSubmitAddUserForm(){
                this.isLoading = true
                axios.post("https://jsonplaceholder.typicode.com/users", this.newUserInfo).then((res)=>{
                    if (res.status == 201) {
                        this.mainUsers.push(res.data)
                        this.showAdModal = false
                        this.handleResetForm()
                        this.pagination()
                        M.toast({html: 'User created successfully...!', classes: 'rounded green'});
                    }
                }).finally(()=>{
                    this.isLoading = false
                })
            },
            handleResetForm(){
                this.newUserInfo = {
                    name:"",
                    username:"",
                    email:"",
                    address:"",
                }
            },
            handleDeleteUser(userId){
                var toastHTML = '<span>Are you sure? ('+userId+')</span><button class="btn-flat toast-action" x-on:click="handleConfirmDeleteUser('+userId+')">Delete</button>';
                M.toast({html: toastHTML});
            },
            handleConfirmDeleteUser(userId){
                this.isLoading = true
                axios.delete("https://jsonplaceholder.typicode.com/users/"+userId).then((res)=>{
                    if (res.status == 200) {
                        this.mainUsers = this.mainUsers.filter(user=>user.id != userId)
                        this.users = this.users.filter(user=>user.id != userId)
                        this.pagination()
                        M.toast({html: 'User deleted successfully...!', classes: 'green'})
                    }
                }).finally(()=>{
                    this.isLoading = false
                })
            },
            handleUpdateUser(user){
                axios.get("https://jsonplaceholder.typicode.com/users/"+user.id).then(res=>{
                    if (res.status == 200) {
                        this.newUserInfo={
                            name:res.data.name,
                            username:res.data.username,
                            email:res.data.email,
                            address:res.data.address,
                        }
                        this.userIdToEdit = res.data.id
                    }
                })
                this.showAdModal = true
            },
            handleConfirmEditUser(){
                this.isLoading = false
                axios.put("https://jsonplaceholder.typicode.com/users/"+this.userIdToEdit, this.newUserInfo).then(res=>{
                    if (res.status == 200) {
                        const userIndex = this.mainUsers.findIndex(user=>user.id == this.userIdToEdit)
                        this.mainUsers[userIndex] = res.data
                        this.showAdModal = false
                        this.handleResetForm()
                        this.userIdToEdit = null
                        this.pagination()
                        M.toast({html: 'User updated successfully...!', classes: 'green'})
                    }
                }).finally(()=>{
                    this.isLoading = false
                })
            }
        }))
})