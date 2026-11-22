// 模擬器清單（首頁與每支模擬器的導覽列共用）。新增模擬器時在這裡加一行。
window.LAB_CATS = {
  sound: { name: "波動與聲音", color: "#0e7490" },
  light: { name: "光學", color: "#b45309" },
  heat: { name: "溫度與熱", color: "#be123c" },
  motion: { name: "力與運動", color: "#4338ca" }
};

window.LAB_SIMS = [
  {"file": "wave-propagation.html", "cat": "sound", "icon": "〰️", "title": "#1 波動傳播與橫波縱波", "desc": "比較橫波與縱波：振動方向與波前進方向的關係，認識波長、振幅與週期。"},
  {"file": "sound-medium-speed.html", "cat": "sound", "icon": "🔊", "title": "#2 聲音傳播介質與聲速", "desc": "聲音需要介質才能傳播：比較固體、液體、氣體中的聲速。"},
  {"file": "echo-sonar.html", "cat": "sound", "icon": "📡", "title": "#3 回聲測距、聲納與超聲波", "desc": "拖曳人物與山壁，用回聲時間算出距離，認識聲納與超聲波的應用。"},
  {"file": "sound-three-elements.html", "cat": "sound", "icon": "📈", "title": "#4 聲音三要素與示波器", "desc": "用示波器波形看響度、音調與音色的差別。"},
  {"file": "sound-frequency-20k.html", "cat": "sound", "icon": "🎵", "title": "0–20,000 Hz 樂音頻率實驗室", "desc": "人類聽覺極限與樂理聲學：從低音到超高頻，聽聽看自己聽得到多高的聲音。"},
  {"file": "sound-spectrum-25k.html", "cat": "sound", "icon": "📊", "title": "0–25,000 Hz 聲波與時頻瀑布圖", "desc": "次聲波、可聽聲、超聲波全頻域模擬，用瀑布圖看見聲音的頻率。"},
  {"file": "spectrogram-2d.html", "cat": "sound", "icon": "🌈", "title": "二維聲波時頻瀑布圖實驗室", "desc": "看見聲音的響度、音調與音色指紋，比較不同樂器的頻譜。"},
  {"file": "tuning-fork.html", "cat": "sound", "icon": "🔔", "title": "音叉縱波產生教學模型", "desc": "音叉臂振動推擠空氣，形成向外傳播的疏密縱波。"},
  {"file": "string-instrument.html", "cat": "sound", "icon": "🎻", "title": "絃樂器聲學互動教學模型", "desc": "調整絃長、張力與粗細，觀察絃的振動與音調高低的關係。"},
  {"file": "water-glass-tube.html", "cat": "sound", "icon": "🧪", "title": "裝水玻璃管聲學探究", "desc": "敲擊與吹氣為什麼音高變化相反？比較質量負載與空氣柱駐波。"},
  {"file": "bat-echolocation.html", "cat": "sound", "icon": "🦇", "title": "蝙蝠超聲波定位與捕食", "desc": "回聲測距、測速與都卜勒效應，搭配追擊運動計算器。"},
  {"file": "pinhole.html", "cat": "light", "icon": "🕳️", "title": "#5 針孔成像", "desc": "光直線前進形成倒立實像：改變物距、像距與孔的大小。"},
  {"file": "reflection-law.html", "cat": "light", "icon": "📐", "title": "#6 光的反射定律與法線", "desc": "入射角等於反射角：拖曳光線，看法線與角度的關係。"},
  {"file": "plane-mirror-drawing.html", "cat": "light", "icon": "✏️", "title": "#7 平面鏡作圖順序", "desc": "一步步學會平面鏡成像作圖：找像點、連線、畫出反射光。"},
  {"file": "plane-mirror-image.html", "cat": "light", "icon": "🪞", "title": "#8 平面鏡成像", "desc": "平面鏡成正立、等大、左右相反的虛像，像距等於物距。"},
  {"file": "curved-mirrors.html", "cat": "light", "icon": "🥄", "title": "#9 凹凸面鏡成像", "desc": "移動物體位置，比較凹面鏡與凸面鏡的成像性質。"},
  {"file": "wheel-refraction-model.html", "cat": "light", "icon": "🛞", "title": "#10 車輪寬帶折射模型", "desc": "用車輪滾進草地的比喻，理解光為什麼在介面上偏折。"},
  {"file": "refraction-total-reflection.html", "cat": "light", "icon": "💎", "title": "#11 光的折射與全反射", "desc": "360° 改變入射方向，觀察折射角變化與臨界角、全反射。"},
  {"file": "lens-surface-refraction.html", "cat": "light", "icon": "🔍", "title": "#13 透鏡曲面折射本質", "desc": "透鏡會聚或發散的原因：光在兩個曲面上各折射一次。"},
  {"file": "lens-types.html", "cat": "light", "icon": "🔎", "title": "#14 凸透鏡與凹透鏡分類", "desc": "從透鏡形狀判斷凸透鏡或凹透鏡，比較會聚與發散。"},
  {"file": "lens-black-box.html", "cat": "light", "icon": "📦", "title": "#15 未知黑盒子組合透鏡", "desc": "從進出光線推理黑盒子裡藏了哪一種透鏡組合。"},
  {"file": "lens-imaging.html", "cat": "light", "icon": "🖼️", "title": "#16 凸凹透鏡折射成像", "desc": "移動物體與透鏡，觀察實像、虛像、放大與縮小的條件。"},
  {"file": "eye-vision.html", "cat": "light", "icon": "👁️", "title": "#17 人眼成像與視力矯正", "desc": "近視、遠視的成因，以及凹透鏡、凸透鏡如何矯正視力。"},
  {"file": "optical-instruments.html", "cat": "light", "icon": "🔭", "title": "#18 四大光學儀器成像", "desc": "照相機、放大鏡、投影機與望遠鏡的成像原理比較。"},
  {"file": "dispersion-color.html", "cat": "light", "icon": "🌈", "title": "#19 光的色散與物體顏色", "desc": "三稜鏡白光色散、RGB 三原色，以及物體為什麼有顏色。"},
  {"file": "heat-transfer.html", "cat": "heat", "icon": "🌡️", "title": "#20 熱傳遞與熱平衡", "desc": "傳導、對流、輻射，以及高低溫物體接觸後達到熱平衡。"},
  {"file": "specific-heat.html", "cat": "heat", "icon": "♨️", "title": "#21 比熱與熱量計算", "desc": "不同物質升溫快慢不同：用 H = m × s × ΔT 計算熱量。"},
  {"file": "buoyancy.html", "cat": "motion", "icon": "🚢", "title": "#22 阿基米德浮力原理", "desc": "浮力等於排開液體的重量：比較沉體、浮體與液體密度。"},
  {"file": "torque-balance.html", "cat": "motion", "icon": "⚖️", "title": "#23 轉動平衡與力矩", "desc": "力矩 = 力 × 力臂：斜拉力的垂直力臂作圖與兩側力矩平衡。"},
  {"file": "ice-push.html", "cat": "motion", "icon": "⛸️", "title": "冰上兩人互推模擬", "desc": "在光滑冰面上互推，體會牛頓第三運動定律與質量、加速度的關係。"},
  {"file": "satellite-orbit.html", "cat": "motion", "icon": "🛰️", "title": "圓周運動與人造衛星軌道", "desc": "重力就是向心力：探索圓軌道速度與逃逸速度。"}
];
