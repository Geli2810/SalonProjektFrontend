import store from "./Store/SYS-Store.js";

export function getCurrentUser() {
  // Søg først efter frisør, så kunde
  const frisor = sessionStorage.getItem("frisor");
  if (frisor) return { ...JSON.parse(frisor), rolle: "frisor" };
  const kunde = sessionStorage.getItem("user");
  if (kunde) return { ...JSON.parse(kunde), rolle: "kunde" };
  return null;
}

export default store;