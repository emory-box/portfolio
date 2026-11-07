# Greeny — website

| File/thư mục | Mục đích |
| --- | --- |
| `index.html` | Tám cảnh cuộn và nội dung case study |
| `greeny.css` | Layout và UI ứng dụng trong case study |
| `garden-story.css` | Layout cảnh cuộn, bảng số liệu, mobile |
| `garden-story.js` | Theo dõi cuộn, trạng thái cảm biến, pause |
| `garden-scene.js` | Tải GLB, xoay vườn, thiết bị và hiệu ứng 3D |
| `garden-overlay.js` | Tín hiệu cảm biến, ánh đèn 2D bám theo model |
| `models/garden.glb` | Model hiện tại được website tải |
| `models/garden.json` | Thông số, palette và hash nguồn |
| `models/colors.json` | Override màu web đã được duyệt |
| `garden-colors.js` | Áp dụng màu và cô lập vật liệu của từng nhóm |
| `img/story/garden-fallback.png` | Ảnh dự phòng khi thiếu 3D/WebGL |
| `img/` | Logo, favicon, ảnh gốc dùng trong case study |

Sửa model: đọc [nguồn dựng](../../authoring/greeny/README.md).
Chỉ đổi màu: đọc [duyệt màu trước](../../docs/greeny/color-review.md).
Khi dời thiết bị, cập nhật tọa độ hiệu ứng trong `garden-scene.js`;
chúng hiện được khai báo riêng với model.
Xem [scroll story](../../docs/greeny/scroll-story.md) và
[model hiện hành](../../docs/greeny/garden-model.md).
Phần sau model theo [cấu trúc case study](../../docs/greeny/case-study.md):
Research → Problem → Personas → Sitemap → Function ideation → Design system
→ Components → Design app.
