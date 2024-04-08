struct GradientPoint {
  vec4 color;
  float position;
};
// GLSL ES 2.0では関数パラメータの配列にサイズが必要。
const int MAX_POINTS = 10;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vModelViewNormal;
varying vec4 vGlPosition;
varying float vVisibility;
uniform sampler2D uTexture;
uniform vec3 uMouse;
uniform float uTime;
uniform int uType;
uniform float uRotation;
uniform float uScale;
uniform float uOffsetSpeed;
uniform float uRotationSpeed;
uniform float uDither;
uniform int uNumPoints;
uniform GradientPoint uPoints[MAX_POINTS];


const float Xn = 0.950470;
const float Yn = 1.0;
const float Zn = 1.088830;
const float T0 = 4.0 / 29.0;
const float T1 = 6.0 / 29.0;
const float T2 = 3.0 * T1 * T1;
const float T3 = T1 * T1 * T1;
const float PI = 3.141592653589793;
const float DEG2RAD = PI / 180.0;
const float RAD2DEG = 180.0 / PI;

const int MIX_TYPE_RGB = 0;
const int MIX_TYPE_HSL = 1;
const int MIX_TYPE_LCH = 2;
const int MIX_TYPE_LAB = 3;
const int MIX_TYPE_HSB = 4;



vec4 makeGradient(
  vec4 colorA, vec4 colorB,
  float stepA, float stepB,
  float val,
  int mixType
) {
  float mixFactor = (val - stepA) / (stepB - stepA);
  if (mixType == MIX_TYPE_LCH) {
    float hueDiffrence = colorB.z - colorA.z;
    hueDiffrence = mod(hueDiffrence + 180.0, 360.0) - 180.0;
    float hue = colorA.z + hueDiffrence * mixFactor;
    hue = mod(hue, 360.0);
    float chroma = mix(colorA.y, colorB.y, mixFactor);
    float lightness = mix(colorA.x, colorB.x, mixFactor);
    float alpha = mix(colorA.w, colorB.w, mixFactor);
    return vec4(lightness, chroma, hue, alpha);
  } else if (mixType == MIX_TYPE_HSL || mixType == MIX_TYPE_HSB) {
    float hueDifference = colorB.x - colorA.x;
    hueDifference = mod(hueDifference + 180.0, 360.0) - 180.0;
    float hue = colorA.x + hueDifference * mixFactor;
    hue = mod(hue, 360.0);
    float saturation = mix(colorA.y, colorB.y, mixFactor);
    float brightness = mix(colorA.z, colorB.z, mixFactor);
    float alpha = mix(colorA.w, colorB.w, mixFactor);
    return vec4(hue, saturation, brightness, alpha);
  } else {
    return mix(colorA, colorB, mixFactor);
  }
}

vec4 makeGradientFromPoints(GradientPoint points[MAX_POINTS], int numPoints, float val, int type) {
  // 最初のポイントよりも小さい場合、最初の色を返す
  if (val <= points[0].position) {
    return points[0].color;
  }
  // valが現在のポイントの位置以下の場合、前のポイントと現在のポイントの間で補間
  for (int i = 1; i < numPoints; ++i) {
    if (val <= points[i].position) {
      return makeGradient(points[i - 1].color, points[i].color, points[i - 1].position, points[i].position, val, type);
    }
  }
  // valが最後の位置を超えている場合、最後の色を返す
  return points[numPoints - 1].color;
}


float rgb_xyz(float r) {
  if (r <= 0.04045) return r / 12.92;
  return pow((r + 0.055) / 1.055, 2.4);
}
float xyz_rgb(float r) {
  if (r <= 0.00304) return 12.92 * r;
  return 1.055 * pow(r, 1.0 / 2.4) - 0.055;
}

float xyz_lab(float t) {
  if (t > T3) return pow(t, 1.0 / 3.0);
  return t / T2 + T0;
}
float lab_xyz(float t) {
  if (t > T1) return t * t * t;
  return T2 * (t - T0);
}


// RGB LAB conversion is ported from chroma.js
// https://github.com/gka/chroma.js
vec3 RGBtoLAB(vec3 rgb) {
  float r = rgb_xyz(rgb.r);
  float g = rgb_xyz(rgb.g);
  float b = rgb_xyz(rgb.b);
  //sRGB -> D65
  float x = xyz_lab((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / Xn);
  float y = xyz_lab((0.2126729 * r + 0.7151522 * g + 0.0721750 * b) / Yn);
  float z = xyz_lab((0.0193339 * r + 0.1191920 * g + 0.9503041 * b) / Zn);
  //
  float l = 116.0 * y - 16.0;
  if (l < 0.0) {
    l = 0.0;
  }
  float a = 500.0 * (x - y);
  float b_ = 200.0 * (y - z);
  return vec3(l, a, b_);
}

vec3 LABtoRGB(vec3 lab) {
  float l = lab.x;
  float a = lab.y;
  float b = lab.z;
  //
  float y = (l + 16.0) / 116.0;
  float x = y + a / 500.0;
  float z = y - b / 200.0;

  y = lab_xyz(y) * Yn;
  x = lab_xyz(x) * Xn;
  z = lab_xyz(z) * Zn;

  //D65 -> sRGB
  float r = xyz_rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z);
  float g = xyz_rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z);
  float b_ = xyz_rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z);
  return vec3(r, g, b_);
}



vec3 LABtoLCH(vec3 lab) {
  float l = lab.x;
  float a = lab.y;
  float b = lab.z;
  float c = sqrt(a * a + b * b);
  float h = mod(atan(b, a) * RAD2DEG + 360.0, 360.0);
  return vec3(l, c, h);
}

vec3 LCHtoLAB(vec3 val) {
  float l = val.x;
  float c = val.y;
  float h = val.z;
  h = h * DEG2RAD;
  //
  float a = cos(h) * c;
  float b = sin(h) * c;
  return vec3(l, a, b);
}



vec3 RGBtoLCH(vec3 color) {
  vec3 lab = RGBtoLAB(color);
  return LABtoLCH(lab);
}
vec3 LCHtoRGB(vec3 color) {
  vec3 lab = LCHtoLAB(color);
  return LABtoRGB(lab);
}









vec3 RGBtoHSL(vec3 color) {
  // R, G, Bの最大値と最小値を求める
  float maxColor = max(max(color.r, color.g), color.b);
  float minColor = min(min(color.r, color.g), color.b);
  // 明度を計算
  float L = (maxColor + minColor) / 2.0;

  float S = 0.0;
  float H = 0.0;

  if (maxColor != minColor) {
    if (L < 0.5) {
      S = (maxColor - minColor) / (maxColor + minColor);
    } else {
      S = (maxColor - minColor) / (2.0 - maxColor - minColor);
    }
    if (color.r == maxColor) {
      H = (color.g - color.b) / (maxColor - minColor);
    } else if (color.g == maxColor) {
      H = 2.0 + (color.b - color.r) / (maxColor - minColor);
    } else {
      H = 4.0 + (color.r - color.g) / (maxColor - minColor);
    }
  }

  H = H * 60.0; // 度数法に変換
  if (H < 0.0) {
    H = H + 360.0;
  }

  return vec3(H, S, L);
}

vec3 HSLtoRGB(vec3 hsl) {
  float H = hsl.x;
  float S = hsl.y;
  float L = hsl.z;

  if (S == 0.0) {
    // 彩度が0の場合は灰色
    return vec3(L, L, L);
  } else {
    float q = L < 0.5 ? L * (1.0 + S) : L + S - L * S;
    float p = 2.0 * L - q;
    float Hk = H / 360.0; // 色相を0から1の範囲に正規化
    float T[3];
    T[0] = Hk + 1.0 / 3.0; // 赤
    T[1] = Hk;           // 緑
    T[2] = Hk - 1.0 / 3.0; // 青
    for (int i = 0; i < 3; ++i) {
      if (T[i] < 0.0) T[i] += 1.0;
      if (T[i] > 1.0) T[i] -= 1.0;
      if ((T[i] * 6.0) < 1.0) {
        T[i] = p + (q - p) * 6.0 * T[i];
      } else if ((T[i] * 2.0) < 1.0) {
        T[i] = q;
      } else if ((T[i] * 3.0) < 2.0) {
        T[i] = p + (q - p) * ((2.0 / 3.0) - T[i]) * 6.0;
      } else {
        T[i] = p;
      }
    }
    return vec3(T[0], T[1], T[2]);
  }
}

vec3 RGBtoHSB(vec3 color) {
  float maxC = max(color.r, max(color.g, color.b));
  float minC = min(color.r, min(color.g, color.b));
  float delta = maxC - minC;

  float H = 0.0;
  if (delta == 0.0) {
    H = 0.0;
  } else if (maxC == color.r) {
    H = 60.0 * (mod((color.g - color.b) / delta, 6.0));
  } else if (maxC == color.g) {
    H = 60.0 * ((color.b - color.r) / delta + 2.0);
  } else if (maxC == color.b) {
    H = 60.0 * ((color.r - color.g) / delta + 4.0);
  }

  float S = maxC == 0.0 ? 0.0 : delta / maxC;

  float B = maxC;

  // Hの範囲を0から360に、SとBの範囲を0から1に正規化
  if (H < 0.0) {
    H += 360.0;
  }

  return vec3(H, S, B);
}

vec3 HSBtoRGB(vec3 hsb) {
  float H = hsb.x;
  float S = hsb.y;
  float B = hsb.z;

  float C = B * S;
  float X = C * (1.0 - abs(mod(H / 60.0, 2.0) - 1.0));
  float m = B - C;
  vec3 rgb;

  if (H >= 0.0 && H < 60.0) {
    rgb = vec3(C, X, 0.0);
  } else if (H >= 60.0 && H < 120.0) {
    rgb = vec3(X, C, 0.0);
  } else if (H >= 120.0 && H < 180.0) {
    rgb = vec3(0.0, C, X);
  } else if (H >= 180.0 && H < 240.0) {
    rgb = vec3(0.0, X, C);
  } else if (H >= 240.0 && H < 300.0) {
    rgb = vec3(X, 0.0, C);
  } else {
    rgb = vec3(C, 0.0, X);
  }

  rgb = rgb + vec3(m, m, m);
  return rgb;
}

float random (vec2 xy) {
  return fract(sin(dot(xy.xy,
  vec2(12.9898 ,78.2338)))*
  43758.5453123);
}

void main() {

  //回転の中心点を0.5, 0.5に動かしてからもとに戻す
  float deg = uRotation + uTime * 5. * uRotationSpeed;
  float rad = deg * DEG2RAD;
  float x = vUv.x;
  float y = vUv.y;
  x = x * 2.0 - 1.0;
  y = y * 2.0 - 1.0;
  float gradientPosition = x * cos(rad) / uScale + y * sin(rad) / uScale;
  gradientPosition = (gradientPosition + 1.0) / 2.0;
  //時間でグラデーションを動かす
    gradientPosition = mod(gradientPosition + uTime /100.0 * uOffsetSpeed, 1.0);

  vec4 gradient = vec4(0.0);
  GradientPoint points[MAX_POINTS];
  if (uType == MIX_TYPE_HSL) {
    for (int i = 0; i < uNumPoints; i++) {
      points[i].color = vec4(RGBtoHSL(uPoints[i].color.rgb), 1.0);
      points[i].position = uPoints[i].position;
    }
    gradient = makeGradientFromPoints(points, uNumPoints, gradientPosition, MIX_TYPE_HSL);
    gradient = vec4(HSLtoRGB(gradient.rgb), 1.0);

  } else if (uType == MIX_TYPE_LCH) {
    for (int i = 0; i < uNumPoints; i++) {
      points[i].color = vec4(RGBtoLCH(uPoints[i].color.rgb), 1.0);
      points[i].position = uPoints[i].position;
    }
    gradient = makeGradientFromPoints(points, uNumPoints, gradientPosition, MIX_TYPE_LCH);
    gradient = vec4(LCHtoRGB(gradient.rgb), 1.0);
  } else if (uType == MIX_TYPE_LAB) {
    for (int i = 0; i < uNumPoints; i++) {
      points[i].color = vec4(RGBtoLAB(uPoints[i].color.rgb), 1.0);
      points[i].position = uPoints[i].position;
    }
    gradient = makeGradientFromPoints(points, uNumPoints, gradientPosition, MIX_TYPE_LAB);
    gradient = vec4(LABtoRGB(gradient.rgb), 1.0);
  } else if (uType == MIX_TYPE_HSB) {
    for (int i = 0; i < uNumPoints; i++) {
      points[i].color = vec4(RGBtoHSB(uPoints[i].color.rgb), 1.0);
      points[i].position = uPoints[i].position;
    }
    gradient = makeGradientFromPoints(points, uNumPoints, gradientPosition, MIX_TYPE_HSB);
    gradient = vec4(HSBtoRGB(gradient.rgb), 1.0);
  } else {
    for (int i = 0; i < uNumPoints; i++) {
      points[i].color = uPoints[i].color;
      points[i].position = uPoints[i].position;
    }
    gradient = makeGradientFromPoints(uPoints, uNumPoints, gradientPosition, MIX_TYPE_RGB);
  }

  float noiseValue = (random(vGlPosition.xy) - 0.5) * 2.0/ 255.0 * uDither;


  vec4 finalColor = vec4(gradient.r + noiseValue, gradient.g + noiseValue, gradient.b + noiseValue, gradient.a);

//  finalColor = vec4(noise, 1.0);
  gl_FragColor = finalColor;
}


