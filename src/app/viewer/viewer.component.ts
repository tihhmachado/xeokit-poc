import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Viewer, WebIFCLoaderPlugin, FastNavPlugin, TreeViewPlugin } from '@xeokit/xeokit-sdk';
import * as WebIFC from 'web-ifc';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css'],
  standalone: true,
})
export class ViewerComponent implements OnInit {
  @ViewChild('viewerCanvas', { static: true }) viewerCanvas?: ElementRef;
  @ViewChild('treeView', { static: true }) treeView?: ElementRef;

  private viewer?: Viewer;
  private ifcLoader?: WebIFCLoaderPlugin;
  private models: { [key: string]: any } = {};

  ngOnInit(): void {
    if (this.viewerCanvas) {
      this.viewer = this.initilizeViewer();
      const ifcAPI = this.configureIfcApi();

      const cfg = {
        wasmPath: './assets/',
        WebIFC: WebIFC,
        IfcAPI: ifcAPI,
      };

      ifcAPI.Init().then(() => {  
        this.ifcLoader = new WebIFCLoaderPlugin(this.viewer!, cfg);
      });
    } else {
      console.error('viewerContainer not initialized');
    }
  }

  private initilizeViewer(): Viewer {
    const viewer = new Viewer({
      canvasId: this.viewerCanvas!.nativeElement.id,
      transparent: true,
      dtxEnabled: true,
    });
    this.configurePerformance(viewer);
    this.configureTreeView(viewer);
    return viewer;
  }

  private configureIfcApi(): WebIFC.IfcAPI {
    const IfcAPI = new WebIFC.IfcAPI();
    IfcAPI.SetWasmPath('./assets/');
    return IfcAPI;
  }

  private configurePerformance(viewer: Viewer): void {
    new FastNavPlugin(viewer, {
      hideEdges: true,
      hideSAO: true,
      hidePBR: true,
      hideTransparentObjects: true,
      scaleCanvasResolution: true,
      scaleCanvasResolutionFactor: 0.7,
      delayBeforeRestore: true,
      delayBeforeRestoreSeconds: 0.3,
    });
  }

  private configureTreeView(viewer: Viewer): void {
    if (this.treeView) {
      new TreeViewPlugin(viewer, {
        containerElementId: this.treeView?.nativeElement.id,
      });
    }
  }

  onModelChange(event: Event, modelName: string): void {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.loadModel(modelName);
    } else {
      this.unloadModel(modelName);
    }
  }

  private loadModel(modelName: string): void {
    if (this.ifcLoader && !this.models[modelName]) {
      const src = `./assets/${modelName}.ifc`;
      const model = this.ifcLoader.load({ src, edges: true });
      model.on('loaded', () => {
        this.viewer!.cameraFlight.flyTo(model);
      });
      this.models[modelName] = model;
    }
  }

  private unloadModel(modelName: string): void {
    const model = this.models[modelName];
    if (model) {
      model.destroy();
      delete this.models[modelName];
    }
  }
}
