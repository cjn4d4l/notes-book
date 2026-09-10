const logButton = document.getElementById("logbtn");

if (logButton) {
	logButton.addEventListener("click", async () => {
	const user = {
		username: document.getElementById("username").value,
		password: document.getElementById("password").value,
	};

	try {
		const response = await fetch("/loginUser/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(user),
		});

		const result = await response.json();

		if (response.ok) {
			console.log(result.message);
            if (!result.status) {
                document.getElementById("message").innerHTML = result.message;
            } else {
				window.location.href = "/";
            }
		} else {
			console.error(result.message);
		}
	} catch (error) {
		console.error("Login request failed:", error);
	}
});
}

const signButton = document.getElementById("signBtn");

if (signButton) {
	signButton.addEventListener("click", async () => {
		const user = {
			username: document.getElementById("username").value.trim(),
			password: document.getElementById("password").value,
		};
		const message = document.getElementById("message");

		if (!user.username || !user.password) {
			message.innerHTML = "Fields should not be empty.";
			return;
		}

		try {
			const response = await fetch("/signupUser/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(user),
			});

			const result = await response.json();
			if (result.status) {
                window.location.href = "/login/";
            } else {
                message.innerHTML = result.message;
            }
		} catch (error) {
			message.innerHTML = "Signup request failed.";
			console.error("Signup request failed:", error);
		}
	});
}
