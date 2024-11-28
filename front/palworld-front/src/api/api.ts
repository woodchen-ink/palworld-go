import axios, { AxiosResponse, AxiosInstance } from 'axios';

// 定义API响应接口
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// 登录状态响应接口
export interface LoginStatusResponse {
  isLoggedIn: boolean;
  error?: string;
}

// 登录响应接口
export interface LoginResponse {
  isLoggedIn: boolean;
  token?: string;
}

class Api {
  private axiosInstance: AxiosInstance;
  private static instance: Api;

  private constructor() {
    this.axiosInstance = axios.create({
      withCredentials: true,
      timeout: 10000, // 10秒超时
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // 添加响应拦截器
    this.axiosInstance.interceptors.response.use(
      response => response,
      error => {
        console.error('API Error:', error);
        if (error.response?.status === 401) {
          // 未授权时重定向到登录页
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // 单例模式获取实例
  public static getInstance(): Api {
    if (!Api.instance) {
      Api.instance = new Api();
    }
    return Api.instance;
  }

  // 检查登录状态
  public async checkLoginStatus(): Promise<LoginStatusResponse> {
    try {
      const response: AxiosResponse<LoginStatusResponse> = 
        await this.axiosInstance.get('/api/check-login-status');
      return response.data;
    } catch (error) {
      console.error('Error checking login status:', error);
      throw error;
    }
  }

  // 登录方法
  public async loginApi(username: string, password: string): Promise<LoginResponse> {
    try {
      const response: AxiosResponse<LoginResponse> = 
        await this.axiosInstance.post('/api/login', {
          username,
          password,
        });
      return response.data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }
}

export default Api.getInstance();
