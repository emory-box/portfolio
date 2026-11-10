# Greeny — website

Trước khi thêm hoặc sửa nội dung Greeny, đọc [global spec](../../docs/shared/website-spec.md)
rồi [local spec](../../docs/greeny/spec.md). Section mới dùng hệ chữ và spacing
title/subtitle đã duyệt trong local spec.

| File/thư mục | Mục đích |
| --- | --- |
| `index.html` | Bảy cảnh cuộn và nội dung case study; cảnh cuối gộp Hub và App |
| `../../assets/css/project-navigation.css` | Header không ghim và giao diện Contents dùng cấu trúc chung, màu Greeny |
| `../../assets/js/project-contents.js` | Nút Contents, nhịp mở/đóng, focus và chỉ báo mục đang đọc |
| `greeny.css` | Layout và UI ứng dụng trong case study |
| `case-study.css` | Trình bày slide 5–49 và ảnh quảng cáo 52 theo các reference đã duyệt; chỉ tác động `.greeny-case-study` |
| `garden-story.css` | Layout cảnh cuộn, bảng số liệu, mobile |
| `garden-story.js` | Theo dõi cuộn, trạng thái cảm biến, pause |
| `garden-scene.js` | Tải GLB, xoay vườn, thiết bị và hiệu ứng 3D |
| `garden-overlay.js` | Tín hiệu cảm biến, ánh đèn 2D bám theo model |
| `garden-connectivity.js` | Illustration mạng 2D, đường Hub/Gateway/Internet/App và nhánh mạng nội bộ |
| `garden-network-story.js` | Đổi phần chữ Hub → App / Online → Offline trong cùng cảnh cuối; giữ nguyên model và sơ đồ |
| `img/story/connectivity-icons.svg` | Illustration Gateway, Internet và Greeny App đã duyệt; nhãn không có đường chỉ vào icon |
| `models/garden.glb` | Model hiện tại được website tải |
| `models/garden.json` | Thông số, palette và hash nguồn |
| `models/colors.json` | Override màu web đã được duyệt |
| `garden-colors.js` | Áp dụng màu và cô lập vật liệu của từng nhóm |
| `img/story/garden-fallback.png` | Ảnh dự phòng khi thiếu 3D/WebGL |
| `img/` | Logo, favicon, ảnh gốc dùng trong case study |

`img/logo-mask.svg` is the supplied vector mark, used by the Greeny header,
footer, Design System lockups and portfolio home. `img/favicon.svg` reuses
its exact path geometry on a square canvas with the brand-green fill. Keep
SVG content under the `.svg` extension so the server sends the correct type.
`img/brand-guideline.svg` is the supplied wide cover (originally named
`favicon.png`), retained as a source asset. The owner-approved opening layout
omits its earlier display and extra logo lockups.

Sửa model: đọc [nguồn dựng](../../authoring/greeny/README.md).
Header và Contents: đọc [quy tắc dùng chung](../../docs/shared/website-spec.md)
và [thiết lập Greeny](../../docs/greeny/spec.md#project-navigation).
Contents có 18 liên kết, mặc định đóng, xuất hiện từ Introduction. Không đưa
các cảnh 3D vào bảng. Chạy `node scripts/qa/check-project-navigation.cjs` khi sửa.
Chỉ đổi màu: đọc [duyệt màu trước](../../docs/greeny/color-review.md).
Khi dời thiết bị, cập nhật tọa độ hiệu ứng trong `garden-scene.js`;
chúng hiện được khai báo riêng với model.
Xem [scroll story](../../docs/greeny/scroll-story.md) và
[model hiện hành](../../docs/greeny/garden-model.md).
Phần sau model dùng slide 5–49, ảnh quảng cáo 52 và các bố cục mới được duyệt trong [cấu trúc case study](../../docs/greeny/case-study.md):
Introduction → Logo / Meaning → Safezone & Grid → User Research / Personas → User Experience /
Function Ideations → Site map → Task Flow → UI system / Colors → Typography → Icon → Components →
User Interface: bốn cụm mockup → ảnh quảng cáo ngoài trời.
Mở đầu bỏ Product ecosystem và tổng quan cảm biến; Logo on grid được bổ sung lại
bên cạnh Safezone. Nội dung mở đầu và UX/UI theo bản SVG tiếng Anh mới; đủ ba
Personas giữ nội dung tiếng Anh đã duyệt. `#system` là anchor tương thích trong About us.

Nguồn chữ, định nghĩa sơ đồ, manifest và bộ dựng HTML/SVG nằm trong
[case-study authoring](../../authoring/greeny/case-study/README.md).
Font tiếng Việt bổ sung được host tại repo, chỉ dùng trong phần case study.

Khoảng cách case study: sáu chương chính dùng khoảng 80–120px và phân cách nhẹ;
các mục con dùng 32–40px, sát với tiêu đề/nội dung hơn. Safezone cùng nền với
Logo, Personas căn theo mép đầu container, các nhóm component gần nhau hơn.
Quy tắc và metadata dựng lại được lưu trong [local spec](../../docs/greeny/spec.md#grouping-spacing-and-responsive-layout)
và `authoring/greeny/case-study/chapter-layout.cjs`.
