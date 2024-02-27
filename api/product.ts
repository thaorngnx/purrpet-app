import api from "./token";

export async function getActiveProducts(params: any) {
    try {
        const response = await api.get("product/query-customer", { params });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function getProductByCode(code: string) {
    try {
        const response = await api.get(`product/${code}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
