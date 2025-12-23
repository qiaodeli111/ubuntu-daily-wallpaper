
import React, { useState } from 'react';
import { Wallpaper } from '../types';

interface UbuntuIntegrationProps {
  wallpaper: Wallpaper | null;
}

const UbuntuIntegration: React.FC<UbuntuIntegrationProps> = ({ wallpaper }) => {
  const [copiedType, setCopiedType] = useState<'current' | 'auto' | null>(null);
  const [activeTab, setActiveTab] = useState<'auto' | 'auto'>('auto');

  const safeTitle = wallpaper?.title.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'wallpaper';
  const currentDate = new Date().toISOString().split('T')[0];

  const currentScript = `
# 修复环境变量，确保能够设置壁纸
export DBUS_SESSION_BUS_ADDRESS="unix:path=/run/user/$(id -u)/bus"

URL="${wallpaper?.url || ''}"
# 使用 年-月-日-标题.jpg 格式保存，避免覆盖旧文件
DEST_DIR="$HOME/Pictures/Wallpapers"
mkdir -p "$DEST_DIR"
FILENAME="${currentDate}-${safeTitle}.jpg"
DEST="$DEST_DIR/$FILENAME"

# 下载图片
wget -O "$DEST" "$URL"

# 检查文件并应用
if [ -s "$DEST" ]; then
    gsettings set org.gnome.desktop.background picture-uri "file://$DEST"
    gsettings set org.gnome.desktop.background picture-uri-dark "file://$DEST"
    echo "已保存并设为壁纸: $DEST"
else
    echo "下载失败。"
fi
  `.trim();

  const autoSyncScript = `
#!/bin/bash
# 自动同步 Bing 每日美图并按日期保存
export DBUS_SESSION_BUS_ADDRESS="unix:path=/run/user/$(id -u)/bus"

# 1. 获取 Bing API 数据
BING_RES=$(curl -s "https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN")
IMG_PATH=$(echo $BING_RES | grep -oP '(?<="url":")[^"]+')
IMG_URL="https://www.bing.com\${IMG_PATH}"

# 提取日期 (YYYYMMDD) 并转换为 YYYY-MM-DD
RAW_DATE=$(echo $BING_RES | grep -oP '(?<="startdate":")[^"]+')
FMT_DATE="\${RAW_DATE:0:4}-\${RAW_DATE:4:2}-\${RAW_DATE:6:2}"

# 2. 准备目录和文件名
DEST_DIR="$HOME/Pictures/Wallpapers"
mkdir -p "$DEST_DIR"
DEST="$DEST_DIR/\${FMT_DATE}-bing.jpg"

# 3. 如果文件不存在则下载，避免重复下载
if [ ! -f "$DEST" ]; then
    wget -q -O "$DEST" "$IMG_URL"
fi

# 4. 设置壁纸
if [ -s "$DEST" ]; then
    gsettings set org.gnome.desktop.background picture-uri "file://$DEST"
    gsettings set org.gnome.desktop.background picture-uri-dark "file://$DEST"
fi
  `.trim();

  const handleCopy = (text: string, type: 'current' | 'auto') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="glass p-6 rounded-3xl mb-8 border border-white/5 shadow-inner">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#E95420]/20 flex items-center justify-center">
            <i className="fab fa-ubuntu text-2xl text-[#E95420]"></i>
          </div>
          <div>
            <h2 className="text-xl font-bold">Ubuntu 自动化历史存档版</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Files stored in ~/Pictures/Wallpapers</p>
          </div>
        </div>
        <div className="flex bg-black/40 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('auto')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'auto' ? 'bg-[#E95420] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            全自动同步 (不覆盖)
          </button>
          <button 
            onClick={() => setActiveTab('current')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'current' ? 'bg-[#E95420] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            设置当前图
          </button>
        </div>
      </div>

      {activeTab === 'auto' ? (
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
            <i className="fas fa-history text-green-400 mt-1"></i>
            <div>
              <p className="text-sm font-semibold text-green-200">已开启“历史存档”模式</p>
              <p className="text-xs text-green-200/60 mt-1">
                此脚本会将壁纸保存到 <code>~/Pictures/Wallpapers</code> 文件夹中，并以日期命名前缀（例如：<code>{currentDate}-bing.jpg</code>）。这样你的壁纸库会日益丰富，不会丢失任何一张美图。
              </p>
            </div>
          </div>
          <div className="bg-black/40 p-4 rounded-xl font-mono text-sm relative group ring-1 ring-white/5">
            <pre className="overflow-x-auto text-orange-400 scrollbar-hide py-2 leading-relaxed">
              <code>{autoSyncScript}</code>
            </pre>
            <button 
              onClick={() => handleCopy(autoSyncScript, 'auto')}
              className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              {copiedType === 'auto' ? <i className="fas fa-check text-green-500"></i> : <i className="far fa-copy"></i>}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-400 text-sm italic">此脚本将保存当前图片为：<code>{currentDate}-{safeTitle}.jpg</code></p>
          <div className="bg-black/40 p-4 rounded-xl font-mono text-sm relative group ring-1 ring-white/5">
            <pre className="overflow-x-auto text-orange-400 leading-relaxed">
              <code>{currentScript}</code>
            </pre>
            <button 
              onClick={() => handleCopy(currentScript, 'current')}
              className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              {copiedType === 'current' ? <i className="fas fa-check text-green-500"></i> : <i className="far fa-copy"></i>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UbuntuIntegration;
