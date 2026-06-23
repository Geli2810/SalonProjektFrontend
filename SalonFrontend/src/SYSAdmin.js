import store from "./Store/SYS-Store.js";

export function getCurrentUser() {
  // Søg først efter frisør, så kunde, så currentUser
  const frisor = sessionStorage.getItem("frisor");
  if (frisor) return { ...JSON.parse(frisor), rolle: "frisor" };
  
  const kunde = sessionStorage.getItem("user");
  if (kunde) return { ...JSON.parse(kunde), rolle: "kunde" };
  
  const currentUser = sessionStorage.getItem("currentUser");
  if (currentUser) {
    const parsed = JSON.parse(currentUser);
    return { ...parsed, rolle: parsed.rolle || "kunde" };
  }
  
  return null; // GÆST = null
}

export default store;