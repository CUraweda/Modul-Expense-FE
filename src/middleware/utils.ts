export const token = {
    get: localStorage.getItem("tokenAccess"),
    set: (value: string) => sessionStorage.setItem("tokenAccess", value),
    delete: () => sessionStorage.removeItem("tokenAccess"),
  };
  