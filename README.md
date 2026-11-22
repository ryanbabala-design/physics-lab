# 自然科互動實驗室

聲音、波動與力學的互動教學模擬器網站，可用 GitHub Pages 免費架設。

## 檔案對照

| 網址檔名 | 原始模擬器 |
|---|---|
| index.html | 首頁（分類目錄） |
| sound-frequency-20k.html | 0 - 20,000 Hz 樂音頻率實驗室 |
| sound-spectrum-25k.html | 0 - 25,000 Hz 聲波演出與時頻瀑布圖模擬系統 |
| spectrogram-2d.html | 2D 聲波時頻瀑布圖實驗室 |
| tuning-fork.html | 音叉縱波產生教學模型 |
| string-instrument.html | 絃樂器聲學互動教學模型 |
| water-glass-tube.html | 裝水玻璃管聲學教學模型 |
| bat-echolocation.html | 蝙蝠超聲波捕食互動模擬與計算器 |
| transverse-longitudinal.html | 橫波縱波 |
| ice-push.html | 冰上兩人互推模擬實驗室 |
| satellite-orbit.html | 圓周運動與人造衛星軌道力學實驗室 |

每個模擬器左下角都加了「⌂ 首頁」按鈕。兩個瀑布圖實驗室和橫波縱波原本只能用滑鼠移動來看十字準線和探針讀數，現在也可以用手指點按、拖曳。

## 新增模擬器

1. 把新的 HTML 檔放進這個資料夾，檔名建議用英文小寫加連字號，例如 `light-reflection.html`
2. 在 HTML 的 `</body>` 前面貼上任一模擬器裡 `<!-- 網站導覽：回首頁按鈕 -->` 那一段
3. 打開 `index.html`，在 `const SIMS = [` 清單中照格式加一行（分類可用 `sound`、`wave`、`motion`；要新增「光」分類，就在 `CATS` 加一行 `light: { name: "光", color: "#ca8a04" }`）
