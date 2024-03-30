const acctUpdfrm = document.querySelector("#acctUpdateFrm")
  acctUpdfrm.addEventListener("input", function () {
    const updateBtn = document.querySelector("button")
    updateBtn.removeAttribute("disabled")
    updateBtn.classList.remove("update-btn")
    updateBtn.classList.add("submit-btn")
  })



// // Store the original values of the form elements when the page loads
// window.addEventListener("load", () => {
//   const form = document.getElementById("my-form");
//   for (const element of form.elements) {
//     if (element.tagName !== "FIELDSET") {
//       form.originalValue = form.originalValue || {};
//       form.originalValue[element.name] = element.value;
//     }
//   }
// });