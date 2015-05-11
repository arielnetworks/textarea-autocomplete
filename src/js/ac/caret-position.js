goog.provide('my.ac.CaretPosition');

goog.require('goog.Disposable');
goog.require('goog.dom');
goog.require('goog.dom.forms');
goog.require('goog.math.Rect');
goog.require('goog.style');

/**
 * @constructor
 * @extends {goog.Disposable}
 * @param {Element} target input[type="text"] or textarea
 */
my.ac.CaretPosition = function(target) {
  var doc = goog.dom.getDocument();
  this.target_ = target;
  var div = this.container_ = doc.createElement('pre');
  [
    'border-style',
    'border-bottom-width',
    'border-left-width',
    'border-right-width',
    'border-top-width',
    'font-family',
    'font-size',
    'font-style',
    'font-variant',
    'font-weight',
    'height',
    'letter-spacing',
    'word-spacing',
    'word-break',
    'word-wrap',
    'overflow-wrap',
    'line-height',
    'margin-bottom',
    'margin-left',
    'margin-right',
    'margin-top',
    'padding-bottom',
    'padding-left',
    'padding-right',
    'padding-top',
    'text-decoration',
    'width'].forEach(function(name) {
    var value = goog.style.getStyle(target, name) || goog.style.getComputedStyle(target, name);
    if (value) {
      goog.style.setStyle(div, name, value);
    }
  });
  goog.style.setPosition(div, goog.style.getPosition(target));
  goog.style.setStyle(div, {
    'position': 'absolute',
    'visibility': 'hidden',
    'z-index': '-9999',
    'overflow': 'hidden',
    'white-space': 'pre-wrap'
  });
  goog.dom.insertSiblingBefore(div, target);
  this.caret_ = doc.createElement('span');
  this.caret_.innerHTML = '&nbsp;';
};
goog.inherits(my.ac.CaretPosition, goog.Disposable);

my.ac.CaretPosition.prototype.getPosition = function(index) {
  var value = goog.dom.forms.getValue(this.target_);
  goog.dom.setTextContent(this.container_, value.slice(0, index));
  this.container_.appendChild(this.caret_);
  this.container_.scrollTop = this.target_.scrollTop;
  var pos = goog.style.getClientPosition(this.caret_);
  return new goog.math.Rect(pos.x, pos.y,
        this.caret_.offsetWidth, this.caret_.offsetHeight);
};

/**
 * @override
 */
my.ac.CaretPosition.prototype.disposeInternal = function() {
  goog.dom.removeNode(this.container_);
  goog.dom.removeNode(this.caret_);
  goog.base(this, 'disposeInternal');
};
