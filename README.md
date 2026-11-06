# CoffeeShop Frontend

Frontend của ứng dụng đặt cà phê BrewLite. Ứng dụng cho phép khách xem thực đơn, tuỳ chỉnh món, thêm vào giỏ hàng, đăng nhập giả lập, tạo đơn và xem lịch sử đơn hàng.

## Công nghệ

- React 19 và TypeScript
- Vite
- TanStack Router
- TanStack Query
- Tailwind CSS 4
- Axios
- ESLint

## Yêu cầu môi trường

- Node.js 20 trở lên
- npm 10 trở lên

## Cài đặt và chạy local

Từ thư mục dự án:

```bash
npm install
npm run dev
```

Sau đó mở URL Vite hiển thị trong terminal, mặc định là <http://localhost:5173>.

Để chạy server cho phép truy cập từ máy khác trong mạng:

```bash
npm run dev -- --host 0.0.0.0
```

## Biến môi trường

Tạo file `.env` ở thư mục gốc và khai báo:

```env
VITE_API_URL=http://localhost:8080
```

`VITE_API_URL` được dùng làm `baseURL` cho Axios trong [src/lib/axios.ts](./src/lib/axios.ts). Nếu không khai báo, frontend sử dụng `http://localhost:8080`.

## Các lệnh thường dùng

```bash
# Chạy môi trường phát triển
npm run dev

# Kiểm tra TypeScript và tạo bản build production
npm run build

# Kiểm tra lint
npm run lint

# Xem bản build production
npm run preview
```

## Các route hiện có

| Route | Mô tả | Điều kiện |
|---|---|---|
| `/` | Trang chủ, hero, lợi ích và thực đơn | Không |
| `/checkout` | Xác nhận thông tin và thanh toán đơn hàng | Phải có phiên đăng nhập và giỏ hàng không rỗng |
| `/orders` | Lịch sử đơn hàng | Không |
| `/orders/:orderId` | Chi tiết đơn hàng và trạng thái đơn | Không |
| `/admin` | Dashboard vận hành | Session role `admin` |
| `/admin/orders` | Theo dõi và cập nhật trạng thái đơn | Session role `admin` |
| `/admin/menu` | Quản lý món và trạng thái hiển thị | Session role `admin` |
| `/admin/customers` | Tổng hợp khách hàng từ đơn online | Session role `admin` |

Router được khai báo theo file-based routing trong [src/routes/](./src/routes/). File [src/routeTree.gen.ts](./src/routeTree.gen.ts) được TanStack Router tự sinh, không nên chỉnh sửa thủ công.

## Luồng nghiệp vụ chính

1. Người dùng vào trang chủ và chọn một sản phẩm.
2. Người dùng chọn kích cỡ, topping và số lượng trong hộp tuỳ chỉnh món.
3. Món được lưu vào giỏ hàng phía client.
4. Người dùng mở giỏ hàng và chuyển tới trang checkout.
5. Nếu chưa đăng nhập, ứng dụng mở dialog đăng nhập giả lập.
6. Người dùng chọn phương thức thanh toán và đặt hàng.
7. Ứng dụng tạo mã đơn, xoá giỏ hàng và chuyển tới trang xác nhận đơn.
8. Lịch sử đơn hàng được lưu ở client để xem lại trong các lần mở ứng dụng tiếp theo.

## Cấu trúc source

```text
src/
├── components/          # Component dùng chung: layout, button, overlay, icon...
├── config/              # Thông tin cửa hàng và cấu hình hiển thị
├── features/
│   ├── auth/             # Đăng nhập và phiên người dùng
│   ├── cart/             # Giỏ hàng, tính giá và drawer
│   ├── checkout/         # Checkout, phương thức thanh toán, tạo đơn
│   ├── home/             # Hero, benefits và trang chủ
│   ├── menu/             # Sản phẩm, menu section và customizer
│   ├── orders/           # Lịch sử, ticket và trạng thái đơn
│   └── admin/            # Layout, dashboard và nghiệp vụ quản trị
│   └── test-connection/  # Kiểm tra kết nối backend
├── lib/                  # Axios, store, format, class name và UI state
├── routes/               # Định nghĩa route của TanStack Router
├── index.css             # Theme và style toàn cục
└── main.tsx              # Entry point, QueryClient và RouterProvider
```

## Trạng thái dữ liệu hiện tại

Phiên bản hiện tại chạy được độc lập để demo:

- Sản phẩm menu đang lấy từ dữ liệu mẫu trong [src/features/menu/data/mock-products.ts](./src/features/menu/data/mock-products.ts).
- Tạo đơn đang mô phỏng độ trễ thanh toán trong [src/features/checkout/api.ts](./src/features/checkout/api.ts).
- Axios đã được cấu hình sẵn trong [src/lib/axios.ts](./src/lib/axios.ts) để kết nối backend sau này.
- Một số state phía client được lưu bằng `localStorage`, gồm phiên đăng nhập, giỏ hàng và lịch sử đơn hàng.
- Tài khoản admin demo dùng email `admin@brewlite.vn`; role chỉ là cơ chế demo phía client, không thay thế phân quyền backend.
- Admin và menu khách dùng chung product store `brewlite:products`; món có `available: false` sẽ không hiển thị ở menu khách.
- Dashboard admin tính số liệu từ order store `brewlite:orders`, không dùng số liệu report hard-code.

Khi backend sẵn sàng, thay implementation trong các file API của feature bằng request Axios tương ứng, đồng thời giữ nguyên kiểu dữ liệu trong các file `types.ts`.

## Tích hợp backend dự kiến

Các API mẫu được ghi chú trực tiếp tại:

- [src/features/menu/api.ts](./src/features/menu/api.ts): `GET /products`
- [src/features/checkout/api.ts](./src/features/checkout/api.ts): `POST /orders`
- [src/features/orders/api.ts](./src/features/orders/api.ts): `PATCH /orders/{id}/status` với body `{ "status": "PREPARING" }`. Trang admin cập nhật trạng thái lạc quan và khôi phục trạng thái trước đó nếu API lỗi.

Backend cần trả JSON phù hợp với các type trong:

- [src/features/menu/types.ts](./src/features/menu/types.ts)
- [src/features/checkout/types.ts](./src/features/checkout/types.ts)
- [src/features/orders/types.ts](./src/features/orders/types.ts)

## Ghi chú phát triển

- Dùng alias `@/` để import từ thư mục `src`.
- Không chỉnh sửa thủ công file route tree được sinh tự động.
- Khi thêm route mới, tạo file trong [src/routes/](./src/routes/) rồi để plugin TanStack Router cập nhật route tree.
- Khi thêm nhóm nghiệp vụ mới, ưu tiên đặt trong một thư mục riêng dưới `src/features/`.
- Hình ảnh sản phẩm demo hiện dùng URL Unsplash, vì vậy cần có kết nối Internet khi tải ảnh.

## Build và kiểm tra trước khi bàn giao

Chạy cả hai lệnh sau:

```bash
npm run lint
npm run build
```

Bản build được tạo trong thư mục `dist/`. Thư mục này không cần commit vào source control.
