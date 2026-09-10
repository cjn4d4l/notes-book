const notesContainer = document.getElementById("notesContainer");
function getPosts() {
    fetch("/getPosts/", { method: "GET" })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            notesContainer.innerHTML = "";
            data.forEach(posts => {
                notesContainer.innerHTML += `
                    <div class="Notes">
                        <h2>${posts.title}</h2> by <strong> ${posts.user} </strong>
                        <p>${posts.content}</p>
                    </div>
                `;
            });

        })
        .catch((error) => console.error("Get posts failed:", error));
}

getPosts();
setInterval(getPosts, 10000);