# Greeny — nguồn dựng model

Chỉ đổi màu trên web: dùng [quy trình duyệt màu](../../docs/greeny/color-review.md).
Luồng đó chạy JavaScript và chụp ảnh bằng Chrome, không cần xuất lại model.
Các lệnh Blender bên dưới dành cho thay đổi model/native render.

| File/thư mục | Mục đích |
| --- | --- |
| `export-garden.py` | Áp dụng chỉnh sửa đã duyệt, xuất model và render |
| `garden_geometry.py` | Các hàm dựng hình còn được exporter sử dụng |
| `source/garden-base.blend` | Cảnh nền bắt buộc để dựng lại; không phải backup thừa |
| `garden.blend` | Model hiện tại hoàn chỉnh, mở trong Blender |
| `renders/` | Hai render hiện tại: mái thu và mở |
| `references/devices/` | Ảnh thiết bị cắt từ clip gốc và manifest nguồn |

Chạy từ root, dùng Blender 5.2:

```powershell
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' --background --factory-startup --python-exit-code 1 --python authoring/greeny/export-garden.py
```

Output web: `projects/greeny/models/garden.glb` và `garden.json`.
Sau khi duyệt, dùng `renders/garden.png` làm
`projects/greeny/img/story/garden-fallback.png`.
Nếu được yêu cầu duyệt trước, chưa thay asset web tới khi chủ dự án đồng ý.

Exporter bắt đầu từ cảnh nền. Sửa trực tiếp `garden.blend` không tự chuyển
ngược vào exporter; ghi thay đổi vào code hoặc cập nhật cảnh nền có chủ đích
để dựng lại được. Giữ tên nhóm `Garden_Root`, `Sensor`, `Fan_Rotor`,
`Shade_Deploy`, `Sprinklers`, `Lights`, `Hub` và các trục xoay.

Kiểm tra native/GLB bằng Blender với
`--python scripts/qa/check-garden.py`. Quyết định model:
[garden model](../../docs/greeny/garden-model.md).
