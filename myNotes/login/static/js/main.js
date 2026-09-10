const logoutButton = document.getElementById("logout");
const openAddPostButton = document.getElementById("openAddPost");
const addPostButton = document.getElementById("addPost");
const addDialog = document.getElementById("addDialog");
const cancelPostButton = document.getElementById("cancelPost");
const notesContainer = document.getElementById("notesContainer");
const goToProfile = document.getElementById("goToProfile");

function getPosts() {
    fetch("/getPosts/", { method: "GET" })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            notesContainer.innerHTML = "";
            let n = 0;
            data.forEach(posts => {
                notesContainer.innerHTML += `
                    <div class="Notes">
                        <h2>${posts.title}</h2> by <strong> ${posts.user} </strong> on ${posts.date}
                        <p>${posts.content}</p>
                    </div>
                `;
                n++;
            });
            if (n < 1) {
                notesContainer.innerHTML = `
                    <div class="Notes" style="background-color: grey">
                        <p>No Notes Posted at the moment</p>
                    </div>
                `;
            }

        })
        .catch((error) => console.error("Get posts failed:", error));
}

getPosts();
setInterval(getPosts, 5000);

if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        if (confirm("Do you want to Log Out?")) {
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

goToProfile.addEventListener("click", () => {
    window.location.href = "/profile/"
})
