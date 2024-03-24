import { DataTexture, FloatType, RGBAFormat } from "three";
import { loadImage } from "./loadImage";

export const getDataTextureFromImage = async (
  url: string,
  textureSize: number,
  imgSize: number = 200
): Promise<DataTexture> => {
  const img = await loadImage(url);
  const canvas = document.createElement("canvas");
  canvas.width = imgSize;
  canvas.height = imgSize;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, imgSize, imgSize);
  const canvasData = ctx.getImageData(0, 0, imgSize, imgSize).data;
  //
  const pixels = [];

  // pixels の内部は r,g,b,a,r,g,b,a,... のように4つ値が連続して並んでいる
  // そのため、i から i+3 までの4つの値を使って1ピクセルの情報を取得する
  for (let i = 0; i < canvasData.length; i += 4) {
    // 左上を0,0として、x,y座標を取得する
    const x = (i / 4) % imgSize;
    const y = Math.floor(i / (4 * imgSize));
    // 画像の明るさが5未満のピクセルを取得する
    if (canvasData[i] < 5) {
      // 0,0 が中心かつ -0.5 〜 0.5 の範囲になるように正規化する
      // x は 左が-0.5, 右が0.5
      // y は 上が0.5, 下が-0.5
      pixels.push({ x: x / imgSize - 0.5, y: 0.5 - y / imgSize });
    }
  }

  const pixelCount = textureSize * textureSize;
  const data = new Float32Array(4 * pixelCount);
  for (let i = 0; i < textureSize; i++) {
    for (let j = 0; j < textureSize; j++) {
      const index = i * textureSize + j;
      // 90%の確率で画像のピクセルからランダムに拾い、残りは完全にランダムなピクセルを使う
      const randomPixel =
        Math.random() < 0.9
          ? pixels[Math.floor(Math.random() * pixels.length)]
          : { x: 3 * (Math.random() - 0.5), y: 3 * (Math.random() - 0.5) };
      // 初期位置を少しずらす
      data[4 * index] = randomPixel.x + (Math.random() - 0.5) * 0.01;
      data[4 * index + 1] = randomPixel.y + (Math.random() - 0.5) * 0.01;
      data[4 * index + 2] = 0;
      data[4 * index + 3] = 1;
    }
  }

  const dataTexture = new DataTexture(data, textureSize, textureSize, RGBAFormat, FloatType);
  dataTexture.needsUpdate = true;

  return dataTexture;
};
