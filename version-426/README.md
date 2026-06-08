# 高清剧集大全

这是一个纯静态电影网站文件包，可直接部署到任意静态服务器。

## 文件结构

- `index.html`：首页，包含 Hero 轮播、分类入口、排行榜区块和全量影片卡片。
- `categories.html`：分类总览页。
- `category/*.html`：独立分类页，共 10 个。
- `ranking.html`：排行榜页。
- `search.html`：搜索与筛选页。
- `movies/movie-1.html` 至 `movies/movie-2000.html`：影片详情页。
- `assets/styles.css`：清晰格式化样式文件。
- `assets/site.js`：清晰格式化交互脚本。
- `assets/hls-player.js`：本地 HLS 播放引擎。

## 封面图片

压缩包未包含 JPG 图片。请在网站顶级目录放入 `1.jpg` 到 `150.jpg`，系统会按影片序号循环引用。

## 生成结果

- 解析影片数量：2000
- 独立详情页数量：2000
- 分类页数量：10
- 可用 m3u8 播放源数量：20
