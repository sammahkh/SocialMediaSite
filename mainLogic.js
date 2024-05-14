const baseUrl="https://tarmeezacademy.com/api/v1"

function setupUI()
    {
      const token =localStorage.getItem("token")
      const loginBtn =document.getElementById("login-btn")
      const registerBtn =document.getElementById("register-btn")
      const logoutBtn =document.getElementById("logout-btn")
      const userImg =document.getElementById("user-img")
      const navUser =document.getElementById("nav-username")

      //add btn
      const addBtn=document.getElementById("add-btn")

      if(token==null)//user is guest (not logged in)
      {
        if(addBtn!=null)
        {
            addBtn.style.setProperty("display","none","important")
        }
       
        loginBtn.style.visibility="visible"
        registerBtn.style.visibility="visible"
        logoutBtn.style.display="none"
        userImg.style.display="none"
        navUser.style.display="none"



      }else{//for logged in user
        if(addBtn!=null)
        {
            addBtn.style.setProperty("display","block","important")
        }
       
        loginBtn.style.visibility="hidden"
        registerBtn.style.visibility="hidden"
        logoutBtn.style.display="block"
        userImg.style.display="inline"
        navUser.style.display="inline"
        const user=getCurrentUser()
        document.getElementById("nav-username").innerHTML=user.username
        document.getElementById("user-img").src=user.profile_image


      }


    }
    function toggleLoader(show=true){
      if(show){
        document.getElementById("loader").style.visibility='visible'
        
      }else{
        document.getElementById("loader").style.visibility='hidden'

      }
    }    

    //auth functions

    function loginBtnClicked()
    {
      toggleLoader(true)
        const username = document.getElementById("username-input").value
        const password = document.getElementById("password-input").value
        const params={
            "username": username,
            "password": password
        }
        const url=`${baseUrl}/login`
        axios.post(url,params)
        .then((response)=>{

           localStorage.setItem("token",response.data.token)
           localStorage.setItem("user",JSON.stringify(response.data.user))
           const modal = document.getElementById("login-modal")
           const modalInstance = bootstrap.Modal.getInstance(modal)
           modalInstance.hide()
           showAlert("Logged in successfully","success")
           setupUI()

        }).catch((error)=>{
          const message=error.response.data.message
          showAlert(message,"danger")
          }
          )
         .finally(()=>{
          toggleLoader(false)

         })

    }
    function registerBtnClicked(){
        const name = document.getElementById("register-name-input").value
        const username = document.getElementById("register-username-input").value
        const password = document.getElementById("register-password-input").value
        const image = document.getElementById("register-img-input").files[0]

        
        toggleLoader(true)
       

        formData=new FormData()
        formData.append("name",name)
        formData.append("username",username)
        formData.append("password",password)
        formData.append("image",image)

        const headers={
            "Content-Type":"multipart/form-data",
          }
        const url=`${baseUrl}/register`
        axios.post(url,formData,{
          headers:headers
        })
        .then((response)=>{
          console.log(response.data)
           localStorage.setItem("token",response.data.token)
           localStorage.setItem("user",JSON.stringify(response.data.user))
           const modal = document.getElementById("register-modal")
           const modalInstance = bootstrap.Modal.getInstance(modal)
           modalInstance.hide()
           showAlert("New User Registerd Successfully","success")
           setupUI()

        }).catch((error)=>{
        const message=error.response.data.message
        showAlert(message,"danger")
        }
        ) .finally(()=>{
          toggleLoader(false)

         })

   
  }


   
    function logout(){
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      showAlert("Logged out successfully")
      setupUI()
    }
    
     

    function getCurrentUser(){
        let user=null
        const storageUser=localStorage.getItem("user")
        if(storageUser!=null){
          user=JSON.parse(storageUser)
        }
        return user
      }
  
      function showAlert(customMessege,type="success"){
        const alertPlaceholder = document.getElementById('success-alert')
     const alert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')
  
    alertPlaceholder.append(wrapper)
  }
      alert(customMessege, type)
  
       // todo: hide the alert
       setTimeout(()=>{
        const alertToHide = bootstrap.Alert.getOrCreateInstance('#success-alert')
       // document.getElementById("success-alert").hide();
       // alertToHide.close()
       },2000) 
   
      }
      function editPostBtnClicked(postObj)

      {
        let post =JSON.parse(decodeURIComponent(postObj))
        document.getElementById("post-modal-submit-btn").innerHTML="Update"
        document.getElementById("post-id-input").value=post.id
        document.getElementById("post-modal-title").innerHTML="Edit Post"
        document.getElementById("post-title-input").value=post.title
        document.getElementById("post-body-input").value=post.body
  
        let postModal= new bootstrap.Modal(document.getElementById("create-post-modal"),{})
        postModal.toggle()
  
  
      }
      function deletePostBtnClicked(postObj)
  
      {
        let post =JSON.parse(decodeURIComponent(postObj))
        document.getElementById("delete-post-id-input").value=post.id
       
  
        let postModal= new bootstrap.Modal(document.getElementById("delete-post-modal"),{})
        postModal.toggle()
  
  
      }
  
      function confirmPostDelete(){
          const token=localStorage.getItem("token")
          const postId=document.getElementById("delete-post-id-input").value
          const url=`${baseUrl}/posts/${postId}`
          const headers={
              "Content-Type":"multipart/form-data",
              "authorization":`Bearer ${token}`
            }
          axios.delete(url,{
            headers:headers
          })
          .then((response)=>{
             
             const modal = document.getElementById("delete-post-modal")
             const modalInstance = bootstrap.Modal.getInstance(modal)
             modalInstance.hide()
             showAlert("The Post Has Been Deleted Successfully","success")
             getPosts()
  
  
          }).catch((error) => {
            const message= error.response.data.message
            showAlert(message,"danger")
  
          })
        }
    function createNewPostBtnClicked()
    {
      toggleLoader(true)
      let postId=document.getElementById("post-id-input").value
      let isCreated= postId==null || postId==""

       const title = document.getElementById("post-title-input").value
        const body= document.getElementById("post-body-input").value
        const image= document.getElementById("post-image-input").files[0]
      let  formData=new FormData()
        formData.append("body",body)
        formData.append("title",title)
        formData.append("image",image)


      
        let url=``
        
          const token =localStorage.getItem("token")
          const headers={
            "Content-Type":"multipart/form-data",
            "authorization":`Bearer ${token}`
          }
        if(isCreated){
          url=`${baseUrl}/posts`
          

        }else{
          formData.append("_method","put")
          url=`${baseUrl}/posts/${postId}`

        }
        axios.post(url,formData,{
          headers:headers
        })
        .then((response)=>{
          const modal = document.getElementById("create-post-modal")
           const modalInstance = bootstrap.Modal.getInstance(modal)
           modalInstance.hide()
           showAlert("New Post Has Been Added","success")
           getPosts()

        }).catch((error)=>{
        const message=error.response.data.message
        showAlert(message,"danger")
        }
        )
        .finally(()=>{
          toggleLoader(false)

         })
    }
    function addBtnClicked(){
      document.getElementById("post-modal-submit-btn").innerHTML="Create"
      document.getElementById("post-id-input").value=""
      document.getElementById("post-modal-title").innerHTML="Create Post"
      document.getElementById("post-title-input").value=""
      document.getElementById("post-body-input").value=""

      let postModal= new bootstrap.Modal(document.getElementById("create-post-modal"),{})
      postModal.toggle()

    }
    function profileClicked(){
     const user= getCurrentUser()
     const userId=user.id
      window.location=`profile.html?userid=${userId}`

    }
    