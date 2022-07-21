const getCookieValue = (name) =>
  document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || "";
window.onload = (e) => {
  let errorMessage = document.getElementById("error_message");

  console.log(errorMessage, "error div ");
  let isError = unescape(getCookieValue("message"));
  console.log("isError:", isError);
  if (isError) {
    errorMessage.classList.remove("hidden");
    errorMessage.textContent = isError;
  }
  document.cookie = "message=";
};
