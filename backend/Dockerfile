# 使用 Python 官方镜像作为基础镜像
FROM python:3.10

# 设置工作目录
WORKDIR /app

# 复制项目的依赖项清单到容器中
COPY requirements.txt .
RUN pip config set global.index-url http://mirrors.aliyun.com/pypi/simple/
RUN pip config set install.trusted-host mirrors.aliyun.com
# 安装项目依赖项
RUN pip install -r requirements.txt

# 复制 Flask 应用程序到容器中的工作目录
COPY . .

# 暴露容器的5000端口
EXPOSE 5000

# 运行 Flask 应用程序
CMD ["python3", "app.py"]