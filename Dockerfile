# 1. Sử dụng image Node.js chính thức
FROM node:22.3.0-alpine

# 2. Đặt thư mục làm việc trong container
WORKDIR /app

# 3. Sao chép file package.json và package-lock.json vào container
COPY package*.json ./

# 4. Cài đặt dependencies
RUN npm install

# 5. Sao chép toàn bộ source code vào container
COPY . .

# 6. Mở cổng 3000 (hoặc cổng bạn sử dụng)
EXPOSE 9999

# 7. Lệnh chạy ứng dụng
CMD ["npm", "start"]