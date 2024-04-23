const float PI = 3.1415926535897932384626433832795;
const float DEG2RAD = PI / 180.0;
const float RAD2DEG = 180.0 / PI;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vModelViewNormal;
varying vec4 vGlPosition;
varying float vVisibility;
uniform float uTime;
uniform vec2 uScreenSize;
uniform float uProgress;
uniform bool uShowUV;
uniform float uParam1;
uniform float uParam2;
uniform float uParam3;
uniform float uParam4;

void main() {
  // テクスチャ座標の中心を(0.5, 0.5)に設定
  vec2 center = vec2(0.5, 0.5);
  // テクスチャ座標と中心との距離を計算
  float distanceFromCenter = distance(vUv, center);

  // 距離に基づいて周期的なパターンを生成（ここで同心円を形成）
  float pattern = sin(pow(distanceFromCenter, 1.5) * 50.0 - uTime/1.5) * 0.6 + 0.6;

  // 色を設定（グレースケールの同心円）
  vec3 color = vec3(pattern);

  // フラグメントの色を設定
  gl_FragColor = vec4(color, 1.0);
}


