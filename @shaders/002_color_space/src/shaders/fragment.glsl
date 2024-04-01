varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vModelViewNormal;
varying float vVisibility;
uniform sampler2D uTexture;
uniform vec3 uMouse;

vec4 makeGradient(
    vec4 colorA, vec4 colorB,
    float stepA, float stepB,
    float val
) {
    // valをグラデーションの範囲内に正規化
    float mixFactor = (val - stepA) / (stepB - stepA);
    // 色相が180度以上離れている場合は近い位置を取るよう補正する
    // ほかは0-1の範囲を取るため、180以上の差は色相環だけと想定していい
    if (colorA.x > 1.0 || colorB.x > 1.0) {
        float hueDifference = colorB.x - colorA.x;
        // 色相の差分を-180から180の範囲に正規化
        hueDifference = mod(hueDifference + 180.0, 360.0) - 180.0;
        float hue = colorA.x + hueDifference * mixFactor;
        // 色相を0から360の範囲に正規化
        hue = mod(hue, 360.0);
        float saturation = mix(colorA.y, colorB.y, mixFactor);
        float brightness = mix(colorA.z, colorB.z, mixFactor);
        float alpha = mix(colorA.w, colorB.w, mixFactor);
        return vec4(hue, saturation, brightness, alpha);
    } else {
        return mix(colorA, colorB, mixFactor);
    }
}

float rgb2lrgb(float c) {
    if (abs(c) < 0.04045) {
        return c / 12.92;
    }
    return sign(c) * pow((abs(c) + 0.055) / 1.055, 2.4);
}

float lrgb2rgb(float c) {
    if (c <= 0.0031308) {
        return 12.92 * c;
    }
    return 1.055 * pow(c, 1.0 / 2.4) - 0.055;
}

vec3 RGBtoXYZ(vec3 color) {
    color = vec3(rgb2lrgb(color.r), rgb2lrgb(color.g), rgb2lrgb(color.b));
    // 以下の変換行列はsRGBからXYZへのものです
    mat3 RGBtoXYZMat = mat3(
        0.4124564, 0.3575761, 0.1804375,
        0.2126729, 0.7151522, 0.0721750,
        0.0193339, 0.1191920, 0.9503041);
    return RGBtoXYZMat * color;
}

vec3 XYZtoRGB(vec3 color) {
    mat3 XYZtoRGBMat = mat3(
        3.2404542, -1.5371385, -0.4985314,
        -0.9692660, 1.8760108, 0.0415560,
        0.0556434, -0.2040259, 1.0572252);
    vec3 rgb = XYZtoRGBMat * color;
    return vec3(lrgb2rgb(rgb.r), lrgb2rgb(rgb.g), lrgb2rgb(rgb.b));
}

// XYZからLABへの変換
vec3 XYZtoLAB(vec3 color) {
    // D65白点を使用
    vec3 whitePoint = vec3(0.95047, 1.00000, 1.08883);
    color /= whitePoint;
    color = vec3(
        color.r > 0.008856 ? pow(color.r, 1.0 / 3.0) : (7.787 * color.r) + (16.0 / 116.0),
        color.g > 0.008856 ? pow(color.g, 1.0 / 3.0) : (7.787 * color.g) + (16.0 / 116.0),
        color.b > 0.008856 ? pow(color.b, 1.0 / 3.0) : (7.787 * color.b) + (16.0 / 116.0));
    return vec3((116.0 * color.g) - 16.0, 500.0 * (color.r - color.g), 200.0 * (color.g - color.b));
}

vec3 LABtoOkLab(vec3 color) {
    vec3 oklab;
    oklab.x = 0.2104542553 * color.x + 0.7936177850 * color.y - 0.0040720468 * color.z;
    oklab.y = 1.9779984951 * color.x - 2.4285922050 * color.y + 0.4505937099 * color.z;
    oklab.z = 0.0259040371 * color.x + 0.7827717662 * color.y - 0.8086757660 * color.z;
    return oklab;
}

vec3 LABtoLCH(vec3 color) {
    return vec3(color.r, sqrt(color.g * color.g + color.b * color.b), atan(color.b, color.g));
}

vec3 RGBtoLAB(vec3 color) {
    vec3 xyz = RGBtoXYZ(color);
    return XYZtoLAB(xyz);
}

vec3 RGBtoOkLAB(vec3 color) {
    vec3 lab = RGBtoLAB(color);
    return LABtoOkLab(lab);
}

vec3 RGBtoLCH(vec3 color) {
    vec3 lab = RGBtoLAB(color);
    return LABtoLCH(lab);
}

vec3 RGBtoOkLCH(vec3 color) {
    vec3 oklab = RGBtoOkLAB(color);
    return LABtoLCH(oklab);
}

vec3 LCHtoLAB(vec3 color) {
    float l = color.x;
    float c = color.y;
    float h = color.z;
    return vec3(l, cos(h) * c, sin(h) * c);
}

vec3 OkLabtoLAB(vec3 color) {
    vec3 lab;
    lab.x = 1.0 * color.x + 0.3963377774 * color.y + 0.2158037573 * color.z;
    lab.y = 1.0 * color.x - 0.1055613458 * color.y - 0.0638541728 * color.z;
    lab.z = 1.0 * color.x - 0.0894841775 * color.y - 1.2914855480 * color.z;
    return lab;
}

vec3 LABtoXYZ(vec3 color) {
    float y = (color.x + 16.0) / 116.0;
    float x = color.y / 500.0 + y;
    float z = y - color.z / 200.0;

    vec3 xyz;
    vec3 whitePoint = vec3(0.95047, 1.00000, 1.08883);

    xyz.x = whitePoint.x * (x > 0.206893 ? pow(x, 3.0) : (x - 16.0 / 116.0) / 7.787);
    xyz.y = whitePoint.y * (y > 0.206893 ? pow(y, 3.0) : (y - 16.0 / 116.0) / 7.787);
    xyz.z = whitePoint.z * (z > 0.206893 ? pow(z, 3.0) : (z - 16.0 / 116.0) / 7.787);

    return xyz;
}



vec3 LABtoRGB(vec3 color) {
    vec3 xyz = LABtoXYZ(color);
    return XYZtoRGB(xyz);
}

vec3 OkLabtoRGB(vec3 color) {
    vec3 lab = OkLabtoLAB(color);
    return LABtoRGB(lab);
}

vec3 LCHtoRGB(vec3 color) {
    vec3 lab = LCHtoLAB(color);
    return LABtoRGB(lab);
}

vec3 OkLCHtoRGB(vec3 color) {
    vec3 okLab = LCHtoLAB(color);
    return OkLabtoRGB(okLab);
}

// GLSL ES 2.0では関数パラメータの配列にサイズが必要。
#define MAX_POINTS 10

struct GradientPoint {
    vec4 color;
    float position;
};

vec4 makeGradientFromPoints(GradientPoint points[MAX_POINTS], int numPoints, float val) {
    // 最初のポイントよりも小さい場合、最初の色を返す
    if (val <= points[0].position) {
        return points[0].color;
    }
    // valが現在のポイントの位置以下の場合、前のポイントと現在のポイントの間で補間
    for (int i = 1; i < numPoints; ++i) {
        if (val <= points[i].position) {
            return makeGradient(points[i - 1].color, points[i].color, points[i - 1].position, points[i].position, val);
        }
    }
    // valが最後の位置を超えている場合、最後の色を返す
    return points[numPoints - 1].color;
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
        // 彩度を計算
        if (L < 0.5) {
            S = (maxColor - minColor) / (maxColor + minColor);
        } else {
            S = (maxColor - minColor) / (2.0 - maxColor - minColor);
        }

        // 色相を計算
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

void main() {
    const int numColors = 2;
    float gradientPosition = vUv.x;
    vec3 rgbA = vec3(0.1216, 0.0, 0.3608);
    vec3 rgbB = vec3(1.0, 0.7098, 0.4196);
    GradientPoint rgb[MAX_POINTS];
    rgb[0] = GradientPoint(vec4(rgbA, 1.0), 0.1);
    rgb[1] = GradientPoint(vec4(rgbB, 1.0), 0.9);
    vec4 rgbGradient = makeGradientFromPoints(rgb, numColors, gradientPosition);

    vec3 labA = RGBtoLAB(rgbA);
    vec3 labB = RGBtoLAB(rgbB);
    GradientPoint lab[MAX_POINTS];
    lab[0] = GradientPoint(vec4(labA, 1.0), 0.1);
    lab[1] = GradientPoint(vec4(labB, 1.0), 0.9);
    vec4 labGradient = makeGradientFromPoints(lab, numColors, gradientPosition);
    labGradient = vec4(LABtoRGB(labGradient.rgb), 1.0);

    vec3 okLabA = RGBtoOkLAB(rgbA);
    vec3 okLabB = RGBtoOkLAB(rgbB);
    GradientPoint okLab[MAX_POINTS];
    okLab[0] = GradientPoint(vec4(okLabA, 1.0), 0.1);
    okLab[1] = GradientPoint(vec4(okLabB, 1.0), 0.9);
    vec4 okLabGradient = makeGradientFromPoints(okLab, numColors, gradientPosition);
    okLabGradient = vec4(OkLabtoRGB(okLabGradient.rgb), 1.0);


    vec3 okLchA = RGBtoOkLCH(rgbA);
    vec3 okLchB = RGBtoOkLCH(rgbB);
    GradientPoint okLCH[MAX_POINTS];
    okLCH[0] = GradientPoint(vec4(okLchA, 1.0), 0.1);
    okLCH[1] = GradientPoint(vec4(okLchB, 1.0), 0.9);
    vec4 okLCHGradient = makeGradientFromPoints(okLCH, numColors, gradientPosition);
    okLCHGradient = vec4(OkLCHtoRGB(okLCHGradient.rgb), 1.0);

    vec3 lchA = RGBtoLCH(rgbA);
    vec3 lchB = RGBtoLCH(rgbB);
    GradientPoint lch[MAX_POINTS];
    lch[0] = GradientPoint(vec4(lchA, 1.0), 0.1);
    lch[1] = GradientPoint(vec4(lchB, 1.0), 0.9);
    vec4 lchGradient = makeGradientFromPoints(lch, numColors, gradientPosition);
    lchGradient = vec4(LCHtoRGB(lchGradient.rgb), 1.0);


    vec3 hslA = RGBtoHSL(rgbA);
    vec3 hslB = RGBtoHSL(rgbB);
    GradientPoint hsl[MAX_POINTS];
    hsl[0] = GradientPoint(vec4(hslA, 1.0), 0.1);
    hsl[1] = GradientPoint(vec4(hslB, 1.0), 0.9);
    vec4 hslGradient = makeGradientFromPoints(hsl, numColors, gradientPosition);
    hslGradient = vec4(HSLtoRGB(hslGradient.rgb), 1.0);

    vec3 hsbA = RGBtoHSB(rgbA);
    vec3 hsbB = RGBtoHSB(rgbB);
    GradientPoint hsb[MAX_POINTS];
    hsb[0] = GradientPoint(vec4(hsbA, 1.0), 0.1);
    hsb[1] = GradientPoint(vec4(hsbB, 1.0), 0.9);
    vec4 hsbGradient = makeGradientFromPoints(hsb, numColors, gradientPosition);
    hsbGradient = vec4(HSBtoRGB(hsbGradient.rgb), 1.0);



    vec4 finalColor = vec4(0.0);
    if (vUv.y < 1.0 / 7.0 * 1.0) {
        finalColor = rgbGradient;
    } else if (vUv.y < 1.0 / 7.0 * 2.0) {
        finalColor = labGradient;
    } else if (vUv.y < 1.0 / 7.0 * 3.0) {
        finalColor = okLabGradient;
    } else if (vUv.y < 1.0 / 7.0 * 4.0) {
        finalColor = okLCHGradient;
    } else if (vUv.y < 1.0 / 7.0 * 5.0) {
        finalColor = lchGradient;
    } else if (vUv.y < 1.0 / 7.0 * 6.0) {
        finalColor = hslGradient;
    } else {
        finalColor = hsbGradient;
    }
    gl_FragColor = finalColor;
}


