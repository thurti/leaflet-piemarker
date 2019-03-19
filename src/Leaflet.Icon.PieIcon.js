(function () {
    'use strict';

    /**
     * @class PieIcon
     * @aka L.Icon.PieIcon
     * @inherits Icon
     * 
     * A simple pie chart svg icon for leaflet based on the article and code from 
     * David Gilbertson: "A simple pie chart in SVG" 
     * @link{https://hackernoon.com/a-simple-pie-chart-in-svg-dbdd653b6936}
     * 
     * Inherits from `Icon` but ignores the `iconUrl` and shadow options.
     * 
     * @example
     * ```js
     * var myIcon = L.Icon.pieIcon({
     *      className: 'my-pie-icon',
     *      data: [
     *          {label: 'myLabel1', value: 10, color: '#ff0000'},
     *          {label: 'myLabel2', value: 80, color: 'blue', style="stroke: black; stroke-width:0.01"},
     *      ]
     * });
     * ```
     * 
     * @author Thomas Hurtig
     * @license BSD-3-Clause
     */
    L.Icon.PieIcon = L.Icon.extend({

        /**
         * @section
         * @aka PieIcon options
         * 
         * @option data: Array = Array.<{label: String, value: Number, color: String, style: String = ''}>
         * Array with data objects for pie chart. eg.: [{label:'Slice1', value:1, color:'red'}, {...}]
         * 
         * @option iconSize: Point = [100, 100]
         * Size of the pie chart in pixels.
         * 
         * @option iconCenter: Boolean = false
         * Center icon so that the center of the circle matches the marker position.
         * Should only be set to true, when PieIcon is used outside of the PieMarker class.
         * 
         * @option precision: Integer
         * Round the percent values calculated from data values to [precision] decimals.
         */
        options: {
            data: [],
            iconSize: [100, 100],
            iconCenter: false,
            precision: 2
        },

        createIcon: function (oldIcon) {
            var svg = this._createSVG(oldIcon);
            this._createSlices(svg);
            
            return svg;
        },

        /**
         * Creates svg element and adds a group for the pie slices.
         *
         * @param {SVGElement} [oldIcon]
         * @returns {SVGElement}
         */
        _createSVG: function (oldIcon) {
            //clean paths and reuse old svg element
            if (oldIcon) {
                var g = oldIcon.querySelector('g');
                
                while (g.firstChild) {
                    g.removeChild(g.firstChild);
                }

                return oldIcon;
            }

            var svg  = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            var size = L.point(this.options.iconSize);
            
            svg.setAttribute('viewBox', '-1 -1 2 2');
            svg.setAttribute('width', size.x.toString());
            svg.setAttribute('height', size.y.toString());
            svg.setAttribute('overflow', 'visible');
            svg.setAttribute('class', 'leaflet-marker-icon ' + (this.options.className || ''));

            //move center of pie to latlng and rotate that 0deg is top
            if (this.options.iconCenter === true) {
                g.setAttribute('transform', 'translate(-1 -1) rotate(-90)');
            } else {
                g.setAttribute('transform', 'rotate(-90)');
            }

            svg.appendChild(g);
            
            return svg;
        },

        /**
         * Creates slice for each data entry and adds slice to svg.
         * 
         * @param {SVGElement} svg
         */
        _createSlices: function (svg) {
            var total = this._getTotal(this.options.data);
            this._cumulativePercent = 0;

            this.options.data.forEach(this._createSlice.bind(this, svg, total));
        },

        /**
         * Creates a sinlge slice path and adds it to svg.
         * 
         * @param {SVGElement} svg
         * @param {Number} total
         * @param {Object} data
         * @param {Number} data.value
         * @param {String} data.color
         */
        _createSlice: function (svg, total, data) {
            var start  = this._getCoordinatesForPercent(this._cumulativePercent);
            var startX = start[0];
            var startY = start[1];

            // calc percent from data value with given precision
            var percent = data.value / total;
            data['percent'] = L.Util.formatNum(percent * 100, this.options.precision);

            // each slice starts where the last slice ended, so keep a cumulative percent
            this._cumulativePercent += percent;
            
            var end = this._getCoordinatesForPercent(this._cumulativePercent);
            var endX = end[0];
            var endY = end[1];
          
            // if the slice is more than 50%, take the large arc (the long way around)
            var largeArcFlag = percent > .5 ? 1 : 0;
          
            // create an array and join it just for code readability
            var pathData = [
              'M ' + startX + ' ' + startY, // Move
              'A 1 1 0 ' + largeArcFlag + ' 1 ' + endX + ' ' + endY, // Arc
              'L 0 0', // Line
            ].join(' ');
          
            var path = this._createPath(pathData, data.color, data.style || '');
            svg.querySelector('g').appendChild(path);  
        },

        /**
         * Creates svg path element.
         * 
         * @param {String} d
         * @param {String} color
         * @returns {SVGPathElement}
         */
        _createPath: function (d, color, style) {
            var pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pathEl.setAttribute('d', d);
            pathEl.setAttribute('fill', color);
            pathEl.setAttribute('style', style);
            return pathEl;
        },

        /**
         * Returns circle coordinates for given percent.
         * 
         * @param {Number} percent
         * @returns {Array}
         */
        _getCoordinatesForPercent: function (percent) {
            var x = Math.cos(2 * Math.PI * percent);
            var y = Math.sin(2 * Math.PI * percent);
            return [x, y];
        },

        /**
         * Returns sum of all data values.
         * 
         * @param {Object[]} data
         * @param {Number} data.value
         * @returns {Number}
         */
        _getTotal: function (data) {
            return data.reduce(function (cumulat, data) {
                return cumulat + data.value;
            }, 0);
        }

    });

    /**
     * Factory
     * @param {Object} options 
     * @returns {L.Icon.Pie}
     */
    L.Icon.pieIcon = function (options) {
        return new L.Icon.PieIcon(options);
    }

})();