import { apiClient } from ".";

export const getCategories = async () => {
  try {
    const response = await apiClient.post("Product/DashBoard", {
      CategoryId: 0,
      DeviceManufacturer: "Google",
      DeviceModel: "Android SDK built for x86",
      DeviceToken: " ",
      PageIndex: 1,
    });

    if (response.ok) {
      return { success: true, data: response.data };
    } else {
      return { success: false, error: response.problem || "Unknown error" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getSubCategories = async (id: number, pageNumber = 1) => {
  try {
    const response = await apiClient.post("Product/DashBoard", {
      CategoryId: id,
      PageIndex: pageNumber,
    });

    if (response.ok) {
      return { success: true, data: response.data };
    } else {
      return { success: false, error: response.problem || "Unknown error" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getProducts = async (id: number, pageNumber = 1) => {
  try {
    const response = await apiClient.post("Product/ProductList", {
      SubCategoryId: id,
      PageIndex: pageNumber,
    });

    if (response.ok) {
      return { success: true, data: response.data };
    } else {
      return { success: false, error: response.problem || "Unknown error" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};
