# 自然科互動實驗室

國中理化互動教學模擬器網站（波動與聲音、光學、溫度與熱、力與運動），可用 GitHub Pages 免費架設。

## 檔案對照

| 網址檔名 | 模擬器 |
|---|---|
| index.html | 首頁（分類目錄） |
| wave-propagation.html | #1 波動傳播與橫波縱波 |
| sound-medium-speed.html | #2 聲音傳播介質與聲速 |
| echo-sonar.html | #3 回聲測距、聲納與超聲波 |
| sound-three-elements.html | #4 聲音三要素與示波器 |
| sound-frequency-20k.html | 0–20,000 Hz 樂音頻率實驗室 |
| sound-spectrum-25k.html | 0–25,000 Hz 聲波與時頻瀑布圖 |
| spectrogram-2d.html | 二維聲波時頻瀑布圖實驗室 |
| tuning-fork.html | 音叉縱波產生教學模型 |
| string-instrument.html | 絃樂器聲學互動教學模型 |
| water-glass-tube.html | 裝水玻璃管聲學探究 |
| bat-echolocation.html | 蝙蝠超聲波定位與捕食 |
| pinhole.html | #5 針孔成像 |
| reflection-law.html | #6 光的反射定律與法線 |
| plane-mirror-drawing.html | #7 平面鏡作圖順序 |
| plane-mirror-image.html | #8 平面鏡成像 |
| curved-mirrors.html | #9 凹凸面鏡成像 |
| wheel-refraction-model.html | #10 車輪寬帶折射模型 |
| refraction-total-reflection.html | #11 光的折射與全反射 |
| lens-surface-refraction.html | #13 透鏡曲面折射本質 |
| lens-types.html | #14 凸透鏡與凹透鏡分類 |
| lens-black-box.html | #15 未知黑盒子組合透鏡 |
| lens-imaging.html | #16 凸凹透鏡折射成像 |
| eye-vision.html | #17 人眼成像與視力矯正 |
| optical-instruments.html | #18 四大光學儀器成像 |
| dispersion-color.html | #19 光的色散與物體顏色 |
| heat-transfer.html | #20 熱傳遞與熱平衡 |
| specific-heat.html | #21 比熱與熱量計算 |
| buoyancy.html | #22 阿基米德浮力原理 |
| torque-balance.html | #23 轉動平衡與力矩 |
| ice-push.html | 冰上兩人互推模擬 |
| satellite-orbit.html | 圓周運動與人造衛星軌道 |

每個模擬器左下角都加了「⌂ 首頁」按鈕。兩個瀑布圖實驗室和橫波縱波原本只能用滑鼠移動來看十字準線和探針讀數，現在也可以用手指點按、拖曳。

## 新增模擬器

1. 把新的 HTML 檔放進這個資料夾，檔名建議用英文小寫加連字號，例如 `light-reflection.html`
2. 在 HTML 的 `</body>` 前面貼上任一模擬器裡 `<!-- 網站導覽：回首頁按鈕 -->` 那一段
3. 打開 `index.html`，在 `const SIMS = [` 清單中照格式加一行（分類可用 `sound`、`light`、`heat`、`motion`）
