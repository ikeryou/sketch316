import { Func } from '../core/func';
import { Canvas } from '../webgl/canvas';
import { Object3D } from 'three/src/core/Object3D';
import { Update } from '../libs/update';
import { Item } from './item';
import { Param } from '../core/param';

export class Visual extends Canvas {

  private _con:Object3D;
  private _item:Array<Item> = [];
  private _formEl:HTMLFormElement;

  constructor(opt: any) {
    super(opt);

    this._con = new Object3D();
    this.mainScene.add(this._con);

    for(let i = 0; i < 20; i++) {
      const item = new Item({
        id:i,
      })
      this._con.add(item);
      this._item.push(item);
    }

    this._formEl = document.querySelector('.l-main input') as HTMLFormElement;
    this._formEl.addEventListener('focus', () => {
      this._show();
    });
    this._formEl.addEventListener('blur', () => {
      this._hide();
    });

    this._resize()
  }


  private _show(): void {
    this._item.forEach((val,i) => {
      val.show(i * 0.025)
    });
  }


  private _hide(): void {
    this._item.forEach((val,i) => {
      const key = (this._item.length - 1) - i
      val.hide(key * 0.01)
    });
  }


  protected _update(): void {
    super._update()

    Param.instance.inputTextNum = this._formEl.value.length;

    this._con.position.y = Func.instance.screenOffsetY() * -1;

    // フォームのサイズ
    let w = 143 + 10;
    let h = 20 + 5;

    const interval = 5 * 2 + 4;

    this._item.forEach((val) => {
      val.itemSize.x = w;
      val.itemSize.y = h;

      w += interval;
      h += interval;
    });

    if (this.isNowRenderFrame()) {
      this._render()
    }
  }


  private _render(): void {
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.render(this.mainScene, this.cameraOrth);
  }


  public isNowRenderFrame(): boolean {
    return this.isRender && Update.instance.cnt % 1 == 0
  }


  _resize(isRender: boolean = true): void {
    super._resize();

    const w = Func.instance.sw();
    const h = Func.instance.sh();

    this.renderSize.width = w;
    this.renderSize.height = h;

    this._updateOrthCamera(this.cameraOrth, w, h);
    this._updatePersCamera(this.cameraPers, w, h);

    let pixelRatio: number = window.devicePixelRatio || 1;

    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(w, h);
    this.renderer.clear();

    if (isRender) {
      this._render();
    }
  }
}
