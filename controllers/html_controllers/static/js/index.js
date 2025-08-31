const LinkContainer = document.getElementById("link-containerId")
const ConentLength=document.getElementById("conentLength")

function GetData() {
    fetch('/html/allFilesApi')
        .then(response => response.json())
        .then(data => {
            ConentLength.innerText=`Totel Files - ${data.allFiles.length}`
            data.allFiles.forEach(item => {
                let p = document.createElement("div");
                p.className = "links-p";
                let a = document.createElement("a");
                a.className = "links";
                a.href = `${item.fileUrl}`;
                a.target = "_blank";
                a.textContent = item.fileName;
                let icon=document.createElement("img");
                icon.className="icon";
                icon.src='/html/static/assets/images/delete.png';
                icon.addEventListener("click", () =>{
                    const ur=item.fileUrl.split("getFile").pop()
                    DeleteData(`/html/deleteFile${ur}`)
                });
                p.appendChild(a);
                p.appendChild(icon)
                LinkContainer.appendChild(p);
            });
        }
        )
}
GetData();
function DeleteData(url){
            fetch(url,{ method: "DELETE"}).then(
             (res)=>{
            LinkContainer.innerHTML=''
            GetData();
             }
            ).catch((err)=>{
                console.log(err)
            })
        
            
}


