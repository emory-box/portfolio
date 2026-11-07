# Moti-Pulse — nguồn tạo asset

## Sơ đồ

`diagrams/flows.json` ghi nhãn/loại node; `diagrams/source/flow-*.svg`
là SVG gốc. `diagrams/information-architecture-source.svg` là nguồn IA.
Giữ nguyên hình học và wiring, chỉ đổi paint khi restyle.

```powershell
node scripts/moti/build-moti-diagrams.cjs
```

Chạy từ root, dùng Chrome/`puppeteer-core`, xuất vào
`projects/moti-pulse/img/diagrams/`.

## Video

`videos/01-...` tới `videos/08-...` là tám dự án HyperFrames, mỗi dự án giữ
clip gốc, frame đầu/cuối và thư viện cục bộ để render độc lập.
`videos/manifest.json` mô tả nguồn/thời lượng; `validation.json` giữ kết quả
giao video. Website chỉ phát MP4 ở `projects/moti-pulse/video/`.

```powershell
node scripts/moti/verify-moti-recording-loops.cjs
node scripts/moti/render-moti-recording-loops.cjs --only 01-life-mission
node scripts/moti/verify-moti-recording-loops.cjs --deep --only 01-life-mission --outputs authoring/moti-pulse/videos/renders
```

Kiểm tra mặc định đối chiếu hash clip nguồn và MP4 đang dùng, không cần
FFmpeg. `--deep` đo SSIM, kiểm tra audio/frame và chạy HyperFrames check;
cần FFmpeg và HyperFrames 0.9.13. Có thể truyền thư mục raw để đối chiếu thêm.
Render trung gian nằm trong `videos/renders/` và được ignore.

`--outputs` chọn thư mục MP4 cần kiểm tra; mặc định là video đang dùng trên
web. Khi vừa render, dùng `--outputs` như ví dụ để kiểm tra bản dựng mới,
không phải video cũ trên web. Bỏ `--only` để kiểm tra cả tám.
Deep check ghi báo cáo vào `.cache/recording-loop-delivery/validation.json`,
không tự ghi đè hồ sơ giao đã duyệt trong nguồn.

Sau khi kiểm chứng và duyệt video mới, thay MP4 tương ứng trong website.
Đồng thời cập nhật các record tương ứng trong `videos/validation.json`
bằng báo cáo mới, để lần kiểm tra hash tiếp theo dùng đúng bản giao.
Giữ nguyên nội dung, timing, audio và tỉ lệ clip gốc; chỉ thêm đoạn quay về
đầu 0.6 giây sau khi nội dung gốc kết thúc.
