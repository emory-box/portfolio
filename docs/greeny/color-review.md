# Greeny — xem màu trước, duyệt rồi áp dụng

Khi chủ dự án yêu cầu đổi màu một vật thể trên web, dùng quy trình này.
Đây là thay màu bằng JavaScript trên cùng GLB và renderer của website;
không dựng lại hình học, không chạy Blender và không dùng AI để vẽ lại ảnh.

## Luồng làm việc

1. Tạo nháp bằng lệnh `preview`. Lệnh mở server tạm, chụp ảnh trước/sau bằng
   Chrome rồi tự đóng server. Bản chính và GLB chưa thay đổi.
2. Gửi `.cache/greeny-color-review/review.png` hoặc trang duyệt cho chủ dự án.
   Chờ đồng ý cho đúng bản màu đó. Đồng ý thiết lập quy trình không phải
   đồng ý một màu thử.
3. Sau khi được duyệt, chạy `approve <draft-id>` của ảnh vừa gửi. Lệnh chỉ
   chốt cấu hình màu và ảnh fallback tương ứng; GLB giữ nguyên.
4. Nếu model, renderer, cấu hình chính hoặc ảnh nháp đã thay đổi sau lúc
   chụp, lệnh chốt từ chối. Tạo lại ảnh để duyệt trước khi áp dụng.

```powershell
node scripts/greeny/colors.cjs list
node scripts/greeny/colors.cjs preview canopy=#2F8FC7
node scripts/greeny/colors.cjs preview fan=#8EBE50 --view 3
# Chỉ sau khi chủ dự án đồng ý đúng bản đang xem:
node scripts/greeny/colors.cjs approve <draft-id>
```

Ảnh được chụp từ cùng renderer/ánh sáng với web, không phải Cycles của
Blender. Mái che mặc định dùng cảnh 4 để thấy màu toàn bộ mái; `--view 0..7`
chọn cảnh khác. Ảnh fallback luôn chụp cảnh giới thiệu, kích thước 1600×1248.
Nháp mới ghi đè nháp trước; không tích lũy thư mục phiên bản.

## Chọn phần cần đổi

`canopy`, `fan`, `sensor`, `hub`, `seedlings`, `grass`, `fence` là tên tắt.
Cũng có thể dùng `material:Shade_Woven=#RRGGBB` hoặc `group:Fan=#RRGGBB`;
`list` in ra các tên có thật trong GLB. Mỗi màu dùng mã hex sáu chữ số.

Đổi vật liệu áp dụng cho các phần dùng vật liệu đó. Đổi nhóm sẽ clone vật
liệu của nhóm, nên quạt không làm đổi đầu tưới dù chúng dùng chung màu trắng.
Giá trị vật liệu cụ thể được ưu tiên hơn giá trị toàn nhóm. Đèn báo hub vẫn
chuyển sang amber khi nhận dữ liệu; màu chỉnh ở trạng thái bình thường.

## File sở hữu dữ liệu

| File | Vai trò |
| --- | --- |
| `projects/greeny/models/colors.json` | Màu web đã được duyệt, được commit |
| `projects/greeny/garden-colors.js` | Kiểm tra và áp dụng profile, tách vật liệu dùng chung |
| `authoring/greeny/color-review.html` | Trang duyệt nội bộ dùng renderer thật |
| `scripts/greeny/colors.cjs` | Tạo nháp, chụp ảnh, kiểm tra và chốt |
| `.cache/greeny-color-review/` | Một bản nháp, ảnh trước/sau, fallback và receipt hiện tại |

Trang duyệt local: `/authoring/greeny/color-review.html`. Nó cần bản nháp
được tạo trên máy; cache không được đưa lên GitHub Pages. Ảnh có thể gửi
trực tiếp cho chủ dự án để duyệt.

`garden.json.palette` và Blender ghi màu baked của model. Màu web hiệu lực
là màu đó cộng các override đã duyệt trong `colors.json`. Xuất lại hình học
không tự xóa override. Nếu cần file Blender/render native cũng có màu mới,
đồng bộ chúng khi thực hiện công việc authoring 3D; luồng nhanh này chỉ quản
lý màu hiển thị trên web và fallback.

Kiểm tra: `node scripts/qa/check-color-workflow.cjs` (dùng fixture tạm, không
duyệt màu trên web chính), cộng hai kiểm tra Greeny khi sửa renderer.

## Kiểm chứng quy trình

Kiểm tra đã qua: nháp không thay file chính; chỉ chốt đúng ID có ảnh đã chụp;
từ chối khi draft/model/renderer/màu chính/ảnh bị đổi; tách vật liệu quạt
khỏi đầu tưới dùng chung vật liệu trắng. Hai bài kiểm tra Greeny giữ nguyên
tám cảnh, pause, reduced motion, no-script và fallback WebGL.
Ảnh web thử được tạo trong khoảng 10–11 giây trên máy hiện tại; không phải
cam kết thời gian cho mọi máy. Không màu thử nào được áp dụng vào bản chính.
Review Standards và Spec không còn findings trong phạm vi này.
