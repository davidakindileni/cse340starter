const acctUpdfrm = document.querySelector("#acctUpdateFrm")
  acctUpdfrm.addEventListener("input", function () {
    const updateBtn = document.querySelector("button")
    updateBtn.removeAttribute("disabled")
    updateBtn.classList.remove("update-btn")
    updateBtn.classList.add("submit-btn")
  })


