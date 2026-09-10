const logoutButton = document.getElementById("logout");
const openAddPostButton = document.getElementById("openAddPost");
const addPostButton = document.getElementById("addPost");
const addDialog = document.getElementById("addDialog");
const cancelPostButton = document.getElementById("cancelPost");
const notesContainer = document.getElementById("notesContainer");
const goToProfile = document.getElementById("goToProfile");

function getPosts() {
    fetch("/getUserPosts/", { method: "GET" })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            notesContainer.innerHTML = "";
            let n = 0;
            data.forEach(posts => {
                notesContainer.innerHTML += `
                    <div class="Notes">
                        <div class="noteHeader">
                            <h2>${posts.title}</h2>
                            <nav class="noteActions">
                                <button class="editButton">Edit</button>
                                <button onclick="deletePost(${posts.id})" class="deleteButton">Delete</button>
                            </nav>
                        </div>
                        <p>Posted on ${posts.date}</p>
                        <p>${posts.content}</p>
                    </div>
                `;
                n++;
            });
            if (n < 1) {
                notesContainer.innerHTML = `
                    <div class="Notes" style="background-color: grey">
                        <p>You have no Posts Yet</p>
                    </div>
                `;
            }
        })
        .catch((error) => console.error("Get posts failed:", error));
}

getPosts();
setInterval(getPosts, 10000)

function deletePost(id) {
    console.log(id);
    if (!confirm("Do you want to delete this post?")) {
        return;
    }
    fetch("/deletePost/", {
        method: "DELETE",
        body: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: id
        })
    }).then(response => response.json()).then(data => {
        console.log(data)
        if (data.status) {
            getPosts();
        }
    }).catch(e => {
        console.log(e)
    })
}

if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        if (confirm("Do you want to log out?")) {
            fetch("/logout/", { method: "POST" })
                .then((response) => response.json())
                .then((data) => {
                    if (data.status) {
                        window.location.href = "/login/";
                    } else {
                        console.log("failed to logout");
                    }
                })
                .catch((error) => console.error("Logout failed:", error));
        }
    });
}

openAddPostButton.addEventListener("click", () => {
    addDialog.showModal();
});

if (addPostButton) {
    addPostButton.addEventListener("click", (event) => {
        event.preventDefault();

        const post = {
            title: document.getElementById("postTitle").value,
            content: document.getElementById("postContent").value,
        };

        if (!post.title || !post.content) {
            return;
        }

        fetch("/addPost/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(post),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                addDialog.close();
            })
            .catch((error) => console.error("Add post failed:", error));
    });
}

cancelPostButton.addEventListener("click", () => {
    addDialog.close();
});