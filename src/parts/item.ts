import vBase from "../glsl/base.vert";
import fImage from "../glsl/item.frag";
import { MyObject3D } from "../webgl/myObject3D";
import { Mesh } from 'three/src/objects/Mesh';
import { Util } from "../libs/util";
import { Vector3 } from 'three/src/math/Vector3';
import { Color } from 'three/src/math/Color';
import { Val } from "../libs/val";
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry';
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial';
import { DoubleSide } from 'three/src/constants';
import { Conf } from "../core/conf";
import { Func } from "../core/func";
import { Tween } from "../core/tween";
import { Param } from "../core/param";

export class Item extends MyObject3D {

  private _id:number;
  private _item:Array<Mesh> = [];
  private _showRate:Val = new Val(0);

  public itemSize:Vector3 = new Vector3(300, 300, 0)

  constructor(opt:any) {
    super()

    this._id = opt.id;

    for(let i = 0; i < 4; i++) {
      const m = new Mesh(
        new PlaneGeometry(1,1),
        new ShaderMaterial({
          vertexShader:vBase,
          fragmentShader:fImage,
          transparent:true,
          side:DoubleSide,
          depthTest:false,
          uniforms:{
            defColor:{value:new Color(0x333333)},
            color:{value:Util.instance.randomArr(Conf.instance.COLOR)},
            rate:{value:0},
          }
        }),
      );
      this.add(m);
      this._item.push(m);
    }
  }


  public show(d:number): void {
    Tween.instance.a(this._showRate, {
      val:1
    }, 1, d, Tween.ExpoEaseOut);
  }


  public hide(d:number): void {
    Tween.instance.a(this._showRate, {
      val:0
    }, 1, d, Tween.ExpoEaseOut)
  }


  protected _update():void {
    super._update();

    const sw = Func.instance.sw();
    const sh = Func.instance.sh();

    const w = this.itemSize.x;
    const h = this.itemSize.y;

    const scale = 1;
    const weight = 5;

    const d = Math.max(sw, sh) * 0.5;
    // const rot = -2;

    this._item.forEach((val) => {
      this._getUni(val).rate.value = Param.instance.inputTextNum > this._id ? 1 : 0;
    })

    // 上
    this._item[0].position.set(0, h * 0.5 + weight * 0.5 + Util.instance.mix(d, 0, this._showRate.val), 0)
    this._item[0].scale.set(w * scale, weight * scale, weight * scale);
    // this._item[0].rotation.x = Util.instance.radian(Util.instance.mix(180 * rot, 0, this._showRate.val))

    // 右
    this._item[1].position.set(w * 0.5 + weight * 0.5 + Util.instance.mix(d, 0, this._showRate.val), 0, 0)
    this._item[1].scale.set(weight * scale, (h + weight * 2) * scale, weight * scale);
    // this._item[1].rotation.y = Util.instance.radian(Util.instance.mix(180 * rot, 0, this._showRate.val))

    // 下
    this._item[2].position.set(0, -h * 0.5 - weight * 0.5 - Util.instance.mix(d, 0, this._showRate.val), 0)
    this._item[2].scale.copy(this._item[0].scale);
    // this._item[2].rotation.x = this._item[0].rotation.x * -1;

    // 右
    this._item[3].position.set(-w * 0.5 - weight * 0.5 - Util.instance.mix(d, 0, this._showRate.val), 0, 0)
    this._item[3].scale.copy(this._item[1].scale);
    // this._item[3].rotation.y = this._item[1].rotation.y * -1;
  }


  protected _resize(): void {
    super._resize();
  }
}