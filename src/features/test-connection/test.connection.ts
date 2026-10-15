import { axiosClient } from "@/lib/axios";

export const testApiConnection = async (): Promise<boolean> => {
    try {
        console.log('🚀 [Test Axios] Đang kiểm tra kết nối tới Server...');

        await axiosClient.get('/hello');
        return true;
    } catch (error: any) {
        console.error('❌ Chi tiết:', error.message);
        console.error('📌 Config request:', error.config);
        return false;
    }
};