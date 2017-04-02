import config from 'app/core/config';
import {PanelCtrl} from  'app/plugins/sdk';

import _ from 'lodash';
import moment from 'moment';
import angular from 'angular';

class BlinkenlightsPanelCtrl extends PanelCtrl {

  constructor($scope, $injector, $q) {
    super($scope, $injector, $q);

    // Set and populate defaults
    var panelDefaults = {
      rowHeight: 100,
      numRows: 2,
      numCols: 8,
      padding: 2,
      interval_ms: 100,
      palette: [
        'rgba(0, 255, 42, 1)',
        'rgba(255, 144, 0, 1)',
        'rgba(255, 33, 0, 1)',
        'rgba(172, 172, 172, 0.1)'
      ]
    };
    _.defaults(this.panel, panelDefaults);


    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('panel-initialized', this.onPanelInitalized.bind(this));
    this.events.on('refresh', this.onRefresh.bind(this));
    this.events.on('render', this.onRender.bind(this));
  }


  onInitEditMode() {
    this.addEditorTab('Options', 'public/plugins/retzkek-blinkenlights-panel/editor.html',1);
    this.editorTabIndex = 1;
    this.refresh();
  }

  initLights() {
    this.lights = [];
    for (var j=0; j < this.panel.numRows; j++) {
      var row = [];
      for (var i=0; i < this.panel.numCols; i++) {
        row.push({ 'color':this.randomColor() });
      }
      this.lights.push(row);
    }
    this.render();
  }

  onPanelInitalized() {
    //console.log("onPanelInitalized()");
    this.initLights();
    this.render();
  }

  onConfigChanged() {
    this.initLights();
    this.render();
  }

  onRefresh() {
    //console.log("onRefresh()");
    var i = Math.floor(this.panel.numCols*Math.random());
    var j = Math.floor(this.panel.numRows*Math.random());
    this.lights[j][i] = { 'color':this.randomColor() };
    this.render();
  }

  onRender() {
    if( !(this.context) ) {
      console.log( 'No context!');
      return;
    }

    var rect = this.wrap.getBoundingClientRect();

    var boxenwidth = rect.width/this.panel.numCols;
    var boxenheight = this.panel.rowHeight;

    var height = boxenheight*this.panel.numRows;
    this.canvas.height = height;
    var width = rect.width;
    this.canvas.width = width;

    var ctx = this.context;

    for (var j=0; j < this.panel.numRows; j++) {
      for (var i=0; i < this.panel.numCols; i++) {
        ctx.beginPath();
        ctx.rect(i*boxenwidth+this.panel.padding, j*boxenheight+this.panel.padding,
                 boxenwidth-this.panel.padding*2, boxenheight-this.panel.padding*2);
        ctx.fillStyle = this.panel.palette[this.lights[j][i].color];
        ctx.fill();
      }
    }
  }

  randomColor() {
    return Math.floor(Math.random()*this.panel.palette.length);
  }

  link(scope, elem, attrs, ctrl) {
    this.wrap = elem.find('.canvas-spot')[0];
    this.canvas = document.createElement("canvas");
    this.wrap.appendChild(this.canvas);

    $(this.canvas).css( 'cursor', 'pointer' );
    $(this.wrap).css( 'width', '100%' );

    //console.log( 'link', this );

    this.context = this.canvas.getContext('2d');
    //console.log(scope);
    this.$interval = this.$injector.get('$interval');
    this.$interval(function() {
      scope.$broadcast('refresh');
    }, this.panel.interval_ms);
  }
}
BlinkenlightsPanelCtrl.templateUrl = 'module.html';

export {
  BlinkenlightsPanelCtrl as PanelCtrl
};


