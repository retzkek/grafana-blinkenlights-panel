'use strict';

System.register(['app/core/config', 'app/plugins/sdk', 'lodash', 'moment', 'angular'], function (_export, _context) {
  "use strict";

  var config, PanelCtrl, _, moment, angular, _createClass, BlinkenlightsPanelCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_appCoreConfig) {
      config = _appCoreConfig.default;
    }, function (_appPluginsSdk) {
      PanelCtrl = _appPluginsSdk.PanelCtrl;
    }, function (_lodash) {
      _ = _lodash.default;
    }, function (_moment) {
      moment = _moment.default;
    }, function (_angular) {
      angular = _angular.default;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('PanelCtrl', BlinkenlightsPanelCtrl = function (_PanelCtrl) {
        _inherits(BlinkenlightsPanelCtrl, _PanelCtrl);

        function BlinkenlightsPanelCtrl($scope, $injector, $q) {
          _classCallCheck(this, BlinkenlightsPanelCtrl);

          var _this = _possibleConstructorReturn(this, (BlinkenlightsPanelCtrl.__proto__ || Object.getPrototypeOf(BlinkenlightsPanelCtrl)).call(this, $scope, $injector, $q));

          // Set and populate defaults
          var panelDefaults = {
            rowHeight: 100,
            numRows: 2,
            numCols: 8,
            padding: 2,
            interval_ms: 100,
            palette: ['rgba(0, 255, 42, 1)', 'rgba(255, 144, 0, 1)', 'rgba(255, 33, 0, 1)', 'rgba(172, 172, 172, 0.1)']
          };
          _.defaults(_this.panel, panelDefaults);

          _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
          _this.events.on('panel-initialized', _this.onPanelInitalized.bind(_this));
          _this.events.on('refresh', _this.onRefresh.bind(_this));
          _this.events.on('render', _this.onRender.bind(_this));
          return _this;
        }

        _createClass(BlinkenlightsPanelCtrl, [{
          key: 'onInitEditMode',
          value: function onInitEditMode() {
            this.addEditorTab('Options', 'public/plugins/retzkek-blinkenlights-panel/editor.html', 1);
            this.editorTabIndex = 1;
            this.refresh();
          }
        }, {
          key: 'initLights',
          value: function initLights() {
            this.lights = [];
            for (var j = 0; j < this.panel.numRows; j++) {
              var row = [];
              for (var i = 0; i < this.panel.numCols; i++) {
                row.push({ 'color': this.randomColor() });
              }
              this.lights.push(row);
            }
            this.render();
          }
        }, {
          key: 'onPanelInitalized',
          value: function onPanelInitalized() {
            //console.log("onPanelInitalized()");
            this.initLights();
            this.render();
          }
        }, {
          key: 'onConfigChanged',
          value: function onConfigChanged() {
            this.initLights();
            this.render();
          }
        }, {
          key: 'onRefresh',
          value: function onRefresh() {
            //console.log("onRefresh()");
            var i = Math.floor(this.panel.numCols * Math.random());
            var j = Math.floor(this.panel.numRows * Math.random());
            this.lights[j][i] = { 'color': this.randomColor() };
            this.render();
          }
        }, {
          key: 'onRender',
          value: function onRender() {
            if (!this.context) {
              console.log('No context!');
              return;
            }

            var rect = this.wrap.getBoundingClientRect();

            var boxenwidth = rect.width / this.panel.numCols;
            var boxenheight = this.panel.rowHeight;

            var height = boxenheight * this.panel.numRows;
            this.canvas.height = height;
            var width = rect.width;
            this.canvas.width = width;

            var ctx = this.context;

            for (var j = 0; j < this.panel.numRows; j++) {
              for (var i = 0; i < this.panel.numCols; i++) {
                ctx.beginPath();
                ctx.rect(i * boxenwidth + this.panel.padding, j * boxenheight + this.panel.padding, boxenwidth - this.panel.padding * 2, boxenheight - this.panel.padding * 2);
                ctx.fillStyle = this.panel.palette[this.lights[j][i].color];
                ctx.fill();
              }
            }
          }
        }, {
          key: 'randomColor',
          value: function randomColor() {
            return Math.floor(Math.random() * this.panel.palette.length);
          }
        }, {
          key: 'link',
          value: function link(scope, elem, attrs, ctrl) {
            this.wrap = elem.find('.canvas-spot')[0];
            this.canvas = document.createElement("canvas");
            this.wrap.appendChild(this.canvas);

            $(this.canvas).css('cursor', 'pointer');
            $(this.wrap).css('width', '100%');

            //console.log( 'link', this );

            this.context = this.canvas.getContext('2d');
            //console.log(scope);
            this.$interval = this.$injector.get('$interval');
            this.$interval(function () {
              scope.$broadcast('refresh');
            }, this.panel.interval_ms);
          }
        }]);

        return BlinkenlightsPanelCtrl;
      }(PanelCtrl));

      BlinkenlightsPanelCtrl.templateUrl = 'module.html';

      _export('PanelCtrl', BlinkenlightsPanelCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
