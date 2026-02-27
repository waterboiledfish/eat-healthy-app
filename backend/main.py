import os
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="吃了么AI识别代理服务")

# 配置CORS，允许前端跨域访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有来源，生产环境可限制为你的前端域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== 凭证配置 ====================
# 菜品识别应用
DISH_API_KEY = "PlUxR12IPkSB7SWnjisxa3W8"
DISH_SECRET_KEY = "Hd1owJDCX4kDxXyxp7RWJH5vszK4Ui4F"
DISH_STATIC_TOKEN = "24.3f7931c6f0fb1897aac6f8c4d2ecf3b5.2592000.1773714229.282335-122092421"

# 组合接口应用（含果蔬识别）
COMBINE_API_KEY = "2gVFAVI89KSInO6YMCMGimSt"
COMBINE_SECRET_KEY = "xqmPDVOjZIq3MbNjL3bJUuLCQTe2yAvC"
COMBINE_STATIC_TOKEN = "24.4a12c5367be42a247e90501eac6c6c1b.2592000.1774343866.282335-122124389"

# ==================== 请求模型 ====================
class ImageRequest(BaseModel):
    image: str  # base64编码的图片（不含data:image前缀）

# ==================== 工具函数 ====================
def get_access_token(api_key, secret_key, static_token):
    """
    获取百度AI access_token，优先使用静态token，失败时尝试获取新token
    实际生产环境建议缓存token并定时刷新
    """
    # 直接返回静态token，简单可靠
    return static_token
    # 如果需要动态获取，可以取消下面注释
    # url = f"https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id={api_key}&client_secret={secret_key}"
    # try:
    #     resp = requests.get(url, timeout=5)
    #     data = resp.json()
    #     return data.get("access_token", static_token)
    # except:
    #     return static_token

# ==================== API端点 ====================

@app.post("/api/recognize/dish")
async def recognize_dish(request: ImageRequest):
    """
    菜品识别代理接口
    前端POST /api/recognize/dish，body包含 {"image": "base64字符串"}
    返回百度API的原始结果
    """
    try:
        access_token = get_access_token(DISH_API_KEY, DISH_SECRET_KEY, DISH_STATIC_TOKEN)
        url = f"https://aip.baidubce.com/rest/2.0/image-classify/v2/dish?access_token={access_token}"
        
        # 构建请求体
        data = {
            "image": request.image,
            "top_num": 5
        }
        
        headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        
        response = requests.post(url, data=data, headers=headers, timeout=10)
        result = response.json()
        
        # 直接返回百度结果
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"代理请求失败: {str(e)}")

@app.post("/api/recognize/ingredient")
async def recognize_ingredient(request: ImageRequest):
    """
    果蔬识别代理接口（通过组合接口）
    前端POST /api/recognize/ingredient，body包含 {"image": "base64字符串"}
    返回百度API的原始结果
    """
    try:
        access_token = get_access_token(COMBINE_API_KEY, COMBINE_SECRET_KEY, COMBINE_STATIC_TOKEN)
        url = f"https://aip.baidubce.com/api/v1/solution/direct/imagerecognition/combination?access_token={access_token}"
        
        # 构建请求体
        payload = {
            "image": request.image,
            "scenes": ["ingredient"]  # 仅需要果蔬识别
        }
        
        headers = {
            "Content-Type": "application/json;charset=utf-8"
        }
        
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        result = response.json()
        
        # 直接返回百度结果
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"代理请求失败: {str(e)}")

# 健康检查端点
@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)