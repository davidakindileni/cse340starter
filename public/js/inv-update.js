const form = document.querySelector("#updateForm")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("button")
      updateBtn.removeAttribute("disabled")
      updateBtn.classList.remove("update-btn")
      updateBtn.classList.add("submit-btn")
    })