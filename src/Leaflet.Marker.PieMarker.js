(function () {
    'use strict';

    /**
     * @class PieMarker
     * @aka L.Marker.PieMarker
     * @inherits Marker
     * 
     * A Marker that uses L.Icon.PieIcon as icon.
     * 
     * @example
     * ```js
     * var myMarker = L.Marker.pieMarker([51.505, -0.09], {
     *      iconSize: [50,50],
     *      data: [
     *           {label: 'A', value: 0.05, color: 'rgba(0,12,50,0.75)', style:'stroke:black;stroke-width:0.01'},
     *           {label: 'B', value: 0.05, color: 'green'},
     *           {label: 'C', value: 0.3, color: 'blue'},
     *           {label: 'D', value: 0.2, color: '#00fffff'},
     *       ]
     * }).addTo(map);
     * ``` 
     * 
     * @author Thomas Hurtig
     * @license BSD-3-Clause
     */
    L.Marker.PieMarker = L.Marker.extend({

        /**
         * @section
         * @aka PieMarker options
         * 
         * @option iconOptions: Object
         * @see L.Icon.PieIcon options
         */
        options: {
            iconOptions: {},
            icon: null
        },

        /**
         * Creates new marker with PieIcon set as icon.
         */
        initialize: function (latlng, options) {
            L.Util.setOptions(this, options);

            if (this.options.icon === null) {
                options.icon = new L.Icon.PieIcon(options.iconOptions);
            }
            
            L.Marker.prototype.initialize.apply(this, [latlng, options]);
        },

        /**
         * Sets marker position.
         * Center icon so that the center of the circle matches the marker position.
         */
        _setPos: function (pos) {
            var bbox = this._icon.getBoundingClientRect();

            pos.x -= Math.round(bbox.width/2);
            pos.y -= Math.round(bbox.height/2);

            L.DomUtil.setPosition(this._icon, pos);

            if (this._shadow) {
                L.DomUtil.setPosition(this._shadow, pos);
            }

            this._zIndex = pos.y + this.options.zIndexOffset;

            this._resetZIndex();
        }

    });

    /**
     * Factory
     * @param {Array} latlng 
     * @param {Object} options 
     */
    L.Marker.pieMarker = function (latlng, options) {
        return new L.Marker.PieMarker(latlng, options);
    }

})();