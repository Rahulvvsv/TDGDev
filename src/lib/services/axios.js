import axios from "axios";

class AxiosService {
  constructor(baseURL = "http://localhost:3000/api/") {
    this.api = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      withCredentials: true,
    });
  }

  //   setAuthCookie(token) {
  //     document.cookie = `authToken=${token}; path=/; Secure; SameSite=Strict`;
  //   }

  //   clearAuthCookie() {
  //     document.cookie =
  //       "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=Strict";
  //   }

  async signUp(data) {
    try {
      const response = await this.api.post("auth/signup/route", data);
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  async login(data) {
    try {
      const response = await this.api.post("auth/signin/route", data);
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  async getAllUploads() {
    try {
      const response = await this.api.get("getAllUploads/route");
      return response.data;
    } catch (error) {
      console.error("Error fetching all uploads:", error);
      throw error;
    }
  }
  async getMyProfile() {
    try {
      const response = await this.api.get("getMyProfile/route");
      return response.data;
    } catch (error) {
      console.error("Error fetching my profile:", error);
      throw error;
    }
  }

  async getFurnitureById(id) {
    try {
      const response = await this.api.get(`getFurnitureById/route?id=${id}`);
      return { data: response.data, error: null };
    } catch (error) {
      console.error("Error fetching furniture by ID:", error.message);
      return { data: null, error: error.message || "An error occurred" };
    }
  }
}

export default AxiosService;
