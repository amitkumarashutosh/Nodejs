const errMsg = document.querySelector(".err-msg");
const btn = document.querySelector(".btn");
const textInput = document.querySelector(".text-input");
const result = document.querySelector(".results");

const taskMessage = (message, color) => {
  setTimeout(() => {
    errMsg.classList.add(color);
    errMsg.textContent = message;
    setTimeout(() => {
      errMsg.classList.remove(color);
      errMsg.textContent = "";
    }, 2000);
  }, 0);
};

//show all tasks
const showTasks = async () => {
  result.innerHTML = "";
  try {
    let tasks;
    await fetch("/api/v1/tasks")
      .then((res) => res.json())
      .then((data) => (tasks = data.tasks));

    // console.log(tasks);

    tasks.forEach((item) => {
      const div = document.createElement("div");
      div.className = "result-text";
      div.innerHTML = `<h3>${item.name}</h3>
        <input type="text" class='result-input'/>
        <span id=${item._id}>
          <i class="fas fa-edit edit"></i>
          <i class="fas fa-trash delete"></i>
      </span>`;
      result.appendChild(div);
    });
    // taskMessage("Task loaded successfully...", "success");
  } catch (error) {
    taskMessage("Connection failed!!", "error");
  }
};

showTasks();

//create task
btn.addEventListener("click", async (e) => {
  e.preventDefault();
  const value = textInput.value;
  if (value === "") {
    taskMessage("This field is required!", "error");
    return;
  }
  await fetch("/api/v1/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: value }),
  });
  textInput.value = "";
  showTasks();
  taskMessage("Task created!", "success");
});

//deleted
result.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete")) {
    const id = e.target.parentNode.id;
    await fetch(`/api/v1/tasks/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    });
    showTasks();
    taskMessage("Deleted successfully!", "success");
  }
});

//update
result.addEventListener("click", async (e) => {
  if (e.target.classList.contains("edit")) {
    const id = e.target.parentNode.id;
    const div = e.target.parentNode.parentNode.children[1];
    div.style.display = "block";
    if (div.value !== "") {
      await fetch(`/api/v1/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ name: div.value }),
      });
      div.style.display = "none";
      showTasks();
      taskMessage("Success", "success");
    }
  }
});
