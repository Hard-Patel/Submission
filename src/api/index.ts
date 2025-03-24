import { create } from "apisauce";

export const apiClient = create({
  baseURL: "http://esptiles.imperoserver.in/api/API/",
  headers: {
    "Content-Type": "application/json",
  },
});
