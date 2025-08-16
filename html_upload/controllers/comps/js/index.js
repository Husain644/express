const LinkContainer = document.getElementById("link-containerId")

function GetData() {
    fetch('/html/allFilesApi')
        .then(response => response.json())
        .then(data => {


            data.allFiles.forEach(item => {
                let p = document.createElement("p");
                p.className = "links-p";
                let a = document.createElement("a");
                a.className = "links";
                a.href = `/html/folderName/${item.catogary}/file/${item.fileName}`;
                a.target = "_blank";
                a.textContent = item.fileName;
                p.appendChild(a);
                LinkContainer.appendChild(p);
            });

        }
        )
}
GetData();