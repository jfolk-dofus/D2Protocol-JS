/*
 *
 *   Right - Responsive Admin Template
 *   v 0.3.0
 *   http://adminbootstrap.com
 *
 */

$(document).ready(function() {
	quickmenu($('.quickmenu__item.active'));

	$('body').on('click', '.quickmenu__item', function() {
		quickmenu($(this))
	});

	function quickmenu(item) {
		var menu = $('.sidebar__menu');
		menu.removeClass('active').eq(item.index()).addClass('active');
		$('.quickmenu__item').removeClass('active');
		item.addClass('active');
		menu.eq(0).css('margin-left', '-'+item.index()*200+'px');
	}

	$('.sidebar li').on('click', function(e) {
		e.stopPropagation();
		var second_nav = $(this).find('.collapse').first();
		if (second_nav.length) {
			second_nav.collapse('toggle');
			$(this).toggleClass('opened');
		}
	});

	$('body.main-scrollable .main__scroll').scrollbar();
	$('.scrollable').scrollbar({'disableBodyScroll' : true});
	$(window).on('resize', function() {
		$('body.main-scrollable .main__scroll').scrollbar();
		$('.scrollable').scrollbar({'disableBodyScroll' : true});
	});

	$('.selectize-dropdown-content').addClass('scrollable scrollbar-macosx').scrollbar({'disableBodyScroll' : true});
	$('.nav-pills, .nav-tabs').tabdrop();

	$('body').on('click', '.header-navbar-mobile__menu button', function() {
		$('.dashboard').toggleClass('dashboard_menu');
	});

	$('.sidestat__chart.sparkline.bar').each(function() {
		$(this).sparkline(
			'html',
			{
				type: 'bar',
				height: '30px',
				barSpacing: 2,
				barColor: '#1e59d9',
				negBarColor: '#ed4949'
			}
		);
	});

	$('.sidestat__chart.sparkline.area').each(function() {
		$(this).sparkline(
			'html',
			{
				width: '145px',
				height: '40px',
				type: 'line',
				lineColor: '#ed4949',
				lineWidth: 2,
				fillColor: 'rgba(237, 73, 73, 0.6)',
				spotColor: '#FF5722',
				minSpotColor: '#FF5722',
				maxSpotColor: '#FF5722',
				highlightSpotColor: '#FF5722',
				spotRadius: 2
			}
		);
	});

	$('.sidestat__chart.sparkline.bar_thin').each(function() {
		$(this).sparkline(
			'html',
			{
				type: 'bar',
				height: '30px',
				barSpacing: 1,
				barWidth: 2,
				barColor: '#FED42A',
				negBarColor: '#ed4949'
			}
		);
	});

	$('.sidestat__chart.sparkline.line').each(function() {
		$(this).sparkline(
			'html',
			{
				type: 'bar',
				height: '30px',
				barSpacing: 2,
				barWidth: 3,
				barColor: '#20c05c',
				negBarColor: '#ed4949'
			}
		);
	});

	$("input.bs-switch").bootstrapSwitch();

	$('.settings-slider').ionRangeSlider({
		decorate_both: false
	});

	if ($('input[type=number]').length) {
		$('input[type=number]').inputNumber({
			mobile: false
		});
	}
});

function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}

(function(root) {
    var isArrayBufferSupported = (new Buffer(new Uint8Array([1]).buffer)[0] === 1);

    var arrayBufferToBuffer = isArrayBufferSupported ? arrayBufferToBufferAsArgument : arrayBufferToBufferCycle;

    function arrayBufferToBufferAsArgument(ab) {
        return new Buffer(ab);
    }

    function arrayBufferToBufferCycle(ab) {
        var buffer = new Buffer(ab.byteLength);
        var view = new Uint8Array(ab);
        for (var i = 0; i < buffer.length; ++i) {
            buffer[i] = view[i];
        }
        return buffer;
    }

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = arrayBufferToBuffer;
        }
        exports.arrayBufferToBuffer = arrayBufferToBuffer;
    } else if (typeof define === 'function' && define.amd) {
        define([], function() {
            return arrayBufferToBuffer;
        });
    } else {
        root.arrayBufferToBuffer = arrayBufferToBuffer;
    }

})(this);

function Events(n){var t={},e=[];n=n||this,n.on=function(n,e,l){(t[n]=t[n]||[]).push([e,l])},n.off=function(n,l){n||(t={});for(var i=t[n]||e,c=i.length=l?i.length:0;c--;)l==i[c][0]&&i.splice(c,1)},n.emit=function(n){for(var l,i=t[n]||e,c=i.length>0?i.slice(0,i.length):i,f=0;l=c[f++];)l[0].apply(l[1],e.slice.call(arguments,1))}}

/**
 * angular-bootstrap-switch
 * @version v0.4.0-alpha.1 - 2015-04-01
 * @author Francesco Pontillo (francescopontillo@gmail.com)
 * @link https://github.com/frapontillo/angular-bootstrap-switch
 * @license Apache License 2.0(http://www.apache.org/licenses/LICENSE-2.0.html)
 **/

(function() {
    'use strict';

// Source: common/module.js
    angular.module('frapontillo.bootstrap-switch', []);

// Source: dist/.temp/directives/bsSwitch.js
    angular.module('frapontillo.bootstrap-switch').directive('bsSwitch', [
        '$parse',
        '$timeout',
        function ($parse, $timeout) {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function link(scope, element, attrs, controller) {
                    var isInit = false;
                    /**
                     * Return the true value for this specific checkbox.
                     * @returns {Object} representing the true view value; if undefined, returns true.
                     */
                    var getTrueValue = function () {
                        if (attrs.type === 'radio') {
                            return attrs.value || $parse(attrs.ngValue)(scope) || true;
                        }
                        var trueValue = $parse(attrs.ngTrueValue)(scope);
                        if (!angular.isString(trueValue)) {
                            trueValue = true;
                        }
                        return trueValue;
                    };
                    /**
                     * Get a boolean value from a boolean-like string, evaluating it on the current scope.
                     * @param value The input object
                     * @returns {boolean} A boolean value
                     */
                    var getBooleanFromString = function (value) {
                        return scope.$eval(value) === true;
                    };
                    /**
                     * Get a boolean value from a boolean-like string, defaulting to true if undefined.
                     * @param value The input object
                     * @returns {boolean} A boolean value
                     */
                    var getBooleanFromStringDefTrue = function (value) {
                        return value === true || value === 'true' || !value;
                    };
                    /**
                     * Returns the value if it is truthy, or undefined.
                     *
                     * @param value The value to check.
                     * @returns the original value if it is truthy, {@link undefined} otherwise.
                     */
                    var getValueOrUndefined = function (value) {
                        return value ? value : undefined;
                    };
                    /**
                     * Get the value of the angular-bound attribute, given its name.
                     * The returned value may or may not equal the attribute value, as it may be transformed by a function.
                     *
                     * @param attrName  The angular-bound attribute name to get the value for
                     * @returns {*}     The attribute value
                     */
                    var getSwitchAttrValue = function (attrName) {
                        var map = {
                            'switchRadioOff': getBooleanFromStringDefTrue,
                            'switchActive': function (value) {
                                return !getBooleanFromStringDefTrue(value);
                            },
                            'switchAnimate': getBooleanFromStringDefTrue,
                            'switchLabel': function (value) {
                                return value ? value : '&nbsp;';
                            },
                            'switchIcon': function (value) {
                                if (value) {
                                    return '<span class=\'' + value + '\'></span>';
                                }
                            },
                            'switchWrapper': function (value) {
                                return value || 'wrapper';
                            },
                            'switchInverse': getBooleanFromString,
                            'switchReadonly': getBooleanFromString
                        };
                        var transFn = map[attrName] || getValueOrUndefined;
                        return transFn(attrs[attrName]);
                    };
                    /**
                     * Set a bootstrapSwitch parameter according to the angular-bound attribute.
                     * The parameter will be changed only if the switch has already been initialized
                     * (to avoid creating it before the model is ready).
                     *
                     * @param element   The switch to apply the parameter modification to
                     * @param attr      The name of the switch parameter
                     * @param modelAttr The name of the angular-bound parameter
                     */
                    var setSwitchParamMaybe = function (element, attr, modelAttr) {
                        if (!isInit) {
                            return;
                        }
                        var newValue = getSwitchAttrValue(modelAttr);
                        element.bootstrapSwitch(attr, newValue);
                    };
                    var setActive = function () {
                        setSwitchParamMaybe(element, 'disabled', 'switchActive');
                    };
                    /**
                     * If the directive has not been initialized yet, do so.
                     */
                    var initMaybe = function () {
                        // if it's the first initialization
                        if (!isInit) {
                            var viewValue = controller.$modelValue === getTrueValue();
                            isInit = !isInit;
                            // Bootstrap the switch plugin
                            element.bootstrapSwitch({
                                radioAllOff: getSwitchAttrValue('switchRadioOff'),
                                disabled: getSwitchAttrValue('switchActive'),
                                state: viewValue,
                                onText: getSwitchAttrValue('switchOnText'),
                                offText: getSwitchAttrValue('switchOffText'),
                                onColor: getSwitchAttrValue('switchOnColor'),
                                offColor: getSwitchAttrValue('switchOffColor'),
                                animate: getSwitchAttrValue('switchAnimate'),
                                size: getSwitchAttrValue('switchSize'),
                                labelText: attrs.switchLabel ? getSwitchAttrValue('switchLabel') : getSwitchAttrValue('switchIcon'),
                                wrapperClass: getSwitchAttrValue('switchWrapper'),
                                handleWidth: getSwitchAttrValue('switchHandleWidth'),
                                labelWidth: getSwitchAttrValue('switchLabelWidth'),
                                inverse: getSwitchAttrValue('switchInverse'),
                                readonly: getSwitchAttrValue('switchReadonly')
                            });
                            if (attrs.type === 'radio') {
                                controller.$setViewValue(controller.$modelValue);
                            } else {
                                controller.$setViewValue(viewValue);
                            }
                        }
                    };
                    /**
                     * Listen to model changes.
                     */
                    var listenToModel = function () {
                        attrs.$observe('switchActive', function (newValue) {
                            var active = getBooleanFromStringDefTrue(newValue);
                            // if we are disabling the switch, delay the deactivation so that the toggle can be switched
                            if (!active) {
                                $timeout(function () {
                                    setActive(active);
                                });
                            } else {
                                // if we are enabling the switch, set active right away
                                setActive(active);
                            }
                        });
                        function modelValue() {
                            return controller.$modelValue;
                        }
                        // When the model changes
                        scope.$watch(modelValue, function (newValue) {
                            initMaybe();
                            if (newValue !== undefined) {
                                element.bootstrapSwitch('state', newValue === getTrueValue(), false);
                            }
                        }, true);
                        // angular attribute to switch property bindings
                        var bindings = {
                            'switchRadioOff': 'radioAllOff',
                            'switchOnText': 'onText',
                            'switchOffText': 'offText',
                            'switchOnColor': 'onColor',
                            'switchOffColor': 'offColor',
                            'switchAnimate': 'animate',
                            'switchSize': 'size',
                            'switchLabel': 'labelText',
                            'switchIcon': 'labelText',
                            'switchWrapper': 'wrapperClass',
                            'switchHandleWidth': 'handleWidth',
                            'switchLabelWidth': 'labelWidth',
                            'switchInverse': 'inverse',
                            'switchReadonly': 'readonly'
                        };
                        var observeProp = function (prop, bindings) {
                            return function () {
                                attrs.$observe(prop, function () {
                                    setSwitchParamMaybe(element, bindings[prop], prop);
                                });
                            };
                        };
                        // for every angular-bound attribute, observe it and trigger the appropriate switch function
                        for (var prop in bindings) {
                            attrs.$observe(prop, observeProp(prop, bindings));
                        }
                    };
                    /**
                     * Listen to view changes.
                     */
                    var listenToView = function () {
                        if (attrs.type === 'radio') {
                            // when the switch is clicked
                            element.on('change.bootstrapSwitch', function (e) {
                                // discard not real change events
                                if (controller.$modelValue === controller.$viewValue && e.target.checked !== $(e.target).bootstrapSwitch('state')) {
                                    // $setViewValue --> $viewValue --> $parsers --> $modelValue
                                    // if the switch is indeed selected
                                    if (e.target.checked) {
                                        // set its value into the view
                                        controller.$setViewValue(getTrueValue());
                                    } else if (getTrueValue() === controller.$viewValue) {
                                        // otherwise if it's been deselected, delete the view value
                                        controller.$setViewValue(undefined);
                                    }
                                }
                            });
                        } else {
                            // When the checkbox switch is clicked, set its value into the ngModel
                            element.on('switchChange.bootstrapSwitch', function (e) {
                                // $setViewValue --> $viewValue --> $parsers --> $modelValue
                                controller.$setViewValue(e.target.checked);
                            });
                        }
                    };
                    // Listen and respond to view changes
                    listenToView();
                    // Listen and respond to model changes
                    listenToModel();
                    // On destroy, collect ya garbage
                    scope.$on('$destroy', function () {
                        element.bootstrapSwitch('destroy');
                    });
                }
            };
        }
    ]).directive('bsSwitch', function () {
        return {
            restrict: 'E',
            require: 'ngModel',
            template: '<input bs-switch>',
            replace: true
        };
    });
// Source: bsSwitch.suffix
})();