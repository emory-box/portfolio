# Portfolio

Website tĩnh gồm trang tổng hợp, Greeny, Moti-Pulse và Synergy. Không framework,
không frontend build; GitHub Pages phục vụ nhánh `main`, thư mục gốc.

## Chạy web

```powershell
node scripts/serve.cjs
```

Mở <http://localhost:4317/>. Server hỗ trợ byte range để video tua được.
Greeny: `/projects/greeny/`; Moti-Pulse: `/projects/moti-pulse/`.
Synergy: `/projects/synergy/`.

## Tìm đúng nơi để sửa

| Cần sửa | Nơi bắt đầu |
| --- | --- |
| Trang tổng hợp | `index.html`, `assets/css/home.css` |
| Shell, font, token chung | `assets/`, [DESIGN.md](DESIGN.md) |
| Website Greeny | [projects/greeny/README.md](projects/greeny/README.md) |
| Model vườn 3D | [authoring/greeny/README.md](authoring/greeny/README.md) |
| Website Moti-Pulse | [projects/moti-pulse/README.md](projects/moti-pulse/README.md) |
| Website Synergy | [projects/synergy/README.md](projects/synergy/README.md) |
| Nguồn diagram/video Moti | [authoring/moti-pulse/README.md](authoring/moti-pulse/README.md) |
| Quyết định thiết kế, hành vi | [docs/README.md](docs/README.md) |
| Hướng dẫn coding agent | [AGENTS.md](AGENTS.md) |

```text
index.html                Trang tổng hợp
assets/                   CSS, JS, font và thư viện web dùng chung
projects/                 Trang case study và asset web hiện tại
authoring/                Nguồn chỉnh sửa, xuất asset; website không tải
  greeny/                 Blender hiện tại, cảnh nền cần thiết, exporter
  moti-pulse/             Nguồn SVG và tám dự án video gốc
docs/                     Tài liệu hiện hành, chia theo dự án
scripts/                  Setup, server, công cụ Moti và QA
.agents/skills/           Skills vendored; không sửa tay
.cache/                   Output kiểm tra tạm; không commit
```

Chỉ giữ một GLB hiện tại và một bộ MP4 dùng trên web. Nguồn để dựng lại nằm
ở `authoring/`. Preview cũ, render trung gian và cache không thuộc asset web.
Chỉ tạo archive khi chủ dự án yêu cầu giữ lịch sử.

## Máy mới và kiểm tra

Cần Node.js 22+ và Git. Chạy `scripts/setup.ps1` bằng PowerShell hoặc
`bash scripts/setup.sh` trên macOS/Linux để thiết lập Chrome,
`puppeteer-core`, FFmpeg và kiểm tra skills. Blender chỉ cần khi sửa 3D;
HyperFrames chỉ cần khi dựng lại video.

Chạy tại thư mục gốc, khi server đang mở:

```powershell
node scripts/qa/check-site.cjs
node scripts/moti/verify-moti-recording-loops.cjs
node scripts/qa/check-greeny.cjs
node scripts/qa/check-greeny-resilience.cjs
```

Hai lệnh đầu không cần browser. Các lệnh Greeny dùng Chrome, mặc định cổng
4317; đặt `SITE_URL` nếu dùng server khác. Chụp portfolio:

```powershell
$env:SITE_URL = 'http://localhost:4317'
node scripts/qa/screenshots.mjs .cache/qa/screenshots
```

Không có npm build, typecheck hay test runner ở root. Các `package.json`
trong nguồn video chỉ dành cho HyperFrames.

## Deploy và nội dung

GitHub Pages: Settings → Pages → Deploy from a branch → `main` / `(root)`.
Giữ `.nojekyll`, font tự host và mọi URL tương đối. Không commit secret,
`node_modules`, cache hoặc output trung gian.

Greeny là đồ án UX/UI của Tấn Duy, Phương Thanh, Kim Vi, Minh Hiền;
giảng viên Trần Cường Tiến. Moti-Pulse được dựng từ board nghiên cứu gốc;
giữ nguyên nội dung và số liệu. Nguồn raw: `D:\Web-portfolio\Raw`.
Tên chủ portfolio, contact và credit tác giả Moti chưa được cung cấp.
